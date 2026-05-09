const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/**
 * MFevziDemir Solutions - Kurumsal E-Posta Doğrulama Servisi
 * contact@mfevzidemir.com üzerinden şık HTML mail gönderir.
 */

const transporter = nodemailer.createTransport({
    host: 'mail.mfevzidemir.com',
    port: 465,
    secure: true,
    auth: {
        user: 'contact@mfevzidemir.com',
        pass: 'BURAYA_MAIL_SIFRENIZI_YAZIN' // Güvenlik için burayı panelden env variable yapabilirsiniz
    }
});

exports.sendCustomVerificationEmail = functions.https.onCall(async (data, context) => {
    // Güvenlik Kontrolü
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Bu işlem için giriş yapmalısınız.');
    }

    const uid = context.auth.uid;
    const user = await admin.auth().getUser(uid);
    const displayName = data.name || 'Değerli Kullanıcımız';

    // Firebase üzerinden güvenli doğrulama linki oluştur
    const actionCodeSettings = {
        url: 'https://mfevzidemir.com/customer/panel.html', // Doğrulama sonrası dönüş sayfası
        handleCodeInApp: true
    };
    
    const link = await admin.auth().generateEmailVerificationLink(user.email, actionCodeSettings);

    // Kurumsal HTML Şablonu
    const htmlContent = `
    <div style="background-color: #f4f7f9; padding: 50px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <tr>
                <td align="center" style="background-color: #0b1120; padding: 40px 0;">
                    <img src="https://mfevzidemir.com/images/logo.png" alt="MFevziDemir Solutions" width="200" style="display: block;">
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 50px;">
                    <h1 style="color: #0b1120; font-size: 24px; font-weight: 700; margin-bottom: 20px;">Merhaba ${displayName},</h1>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        MFevziDemir Solutions dünyasına hoş geldiniz. Hesabınızın kurulumunu tamamlamak ve projelerinizi yönetmeye başlamak için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center">
                                <a href="${link}" style="background-color: #30A6CD; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Hesabımı Doğrula</a>
                            </td>
                        </tr>
                    </table>
                    <p style="color: #9ca3af; font-size: 13px; margin-top: 40px; text-align: center;">
                        Eğer bu işlemi siz yapmadıysanız, lütfen bu maili dikkate almayınız.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #edf2f7;">
                    <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">© 2026 MFevziDemir Solutions. Tüm hakları saklıdır.</p>
                    <p style="color: #30A6CD; font-size: 12px; font-weight: 600;">Kuşadası, Aydın / Türkiye</p>
                </td>
            </tr>
        </table>
    </div>`;

    try {
        await transporter.sendMail({
            from: '"MFevziDemir Solutions" <contact@mfevzidemir.com>',
            to: user.email,
            subject: 'E-posta Adresinizi Doğrulayın',
            html: htmlContent
        });
        return { success: true, message: 'Kurumsal mail gönderildi.' };
    } catch (error) {
        console.error('Mail Gönderim Hatası:', error);
        throw new functions.https.HttpsError('internal', 'Mail gönderilemedi.');
    }
});


import jwt from "jsonwebtoken";// kullanıcı girişlerinde kimlik doğrulamak için kullanılır.
//Kullanıcı giriş yaptıktan sonra bir “jeton” (token) üretilir ve bu tarayıcıya gönderilir.

//Bu fonksiyon iki parametre alıyor:
//userId: Token içine yerleştirilecek kullanıcı ID'si.
//res: Token'ı cookie olarak göndermek için response nesnesi.
export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",//expiresIn: "7d"	Token 7 gün sonra geçersiz olacak.
    });
    //{ userId }	Token içine bu bilgi yerleştirilecek.
    //process.env.JWT_SECRET	Token’ı imzalamak için gizli anahtar (güvenlik için .env’de tutulur).
    ////////

    res.cookie("jwt", token, {//jwt	Cookie adı.
        maxAge: 7 * 24 * 60 * 60 * 1000,     //	7 gün (milisaniye cinsinden)
        httpOnly: true,  //httpOnly: true	JavaScript ile erişilemez (XSS’e karşı güvenli).
        sameSite: "strict",  //sameSite: "strict"	CSRF saldırılarına karşı koruma sağlar.
        secure: process.env.NODE_ENV !== "development",//secure	Sadece HTTPS bağlantılarında çalışır (production’da aktiftir).
    });
    return token;//İstenirse bu token başka yerde de kullanılabilir (mesela frontend'e JSON içinde gönderilebilir).


};

//Bu yardımcı fonksiyon, kullanıcının userId bilgisiyle bir JWT token oluşturdu, 7 günlük süre verdi ve bunu güvenli şekilde cookie olarak tarayıcıya gönderdi.
//Bu işlem genellikle kullanıcı giriş (login) işlemi sonrası yapılır.


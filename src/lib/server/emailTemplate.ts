// File: frontend/src/lib/server/emailTemplates.ts
interface EmailTemplate {
    subject: string;
    html: string;
    text: string;
}

class EmailTemplates {
    getWelcomeTemplate(language: string = 'it'): EmailTemplate {
        const templates: Record<string, EmailTemplate> = {
            it: {
                subject: 'Benvenuto alla Newsletter del Museo Zungri! 🏛️',
                html: `
                    <!DOCTYPE html>
                    <html lang="it">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Benvenuto al Museo Zungri</title>
                        <style>
                            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; }
                            .header { background: linear-gradient(135deg, #8B5A3C 0%, #A0522D 100%); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
                            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
                            .content { padding: 40px 30px; }
                            .content h2 { color: #8B5A3C; margin-top: 0; font-size: 24px; }
                            .benefits { background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8B5A3C; }
                            .benefits ul { margin: 0; padding-left: 20px; }
                            .benefits li { margin-bottom: 8px; }
                            .cta { text-align: center; margin: 30px 0; }
                            .cta a { background-color: #8B5A3C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
                            .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 14px; }
                            .footer a { color: #ecf0f1; }
                            .divider { height: 1px; background-color: #eee; margin: 30px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏛️ MUSEO ZUNGRI</h1>
                                <p>Tesori del Patrimonio Culturale Calabrese</p>
                            </div>
                            
                            <div class="content">
                                <h2>Benvenuto nella famiglia del Museo Zungri!</h2>
                                
                                <p>Caro appassionato di storia e cultura,</p>
                                
                                <p>Grazie di cuore per esserti iscritto alla nostra newsletter! Sei ora parte di una comunità esclusiva che celebra e preserva il ricco patrimonio archeologico e culturale di Zungri e della Calabria.</p>
                                
                                <div class="benefits">
                                    <h3 style="color: #8B5A3C; margin-top: 0;">Cosa riceverai:</h3>
                                    <ul>
                                        <li><strong>Scoperte Archeologiche</strong> - Le ultime ricerche e ritrovamenti</li>
                                        <li><strong>Eventi Esclusivi</strong> - Mostre, conferenze e visite guidate</li>
                                        <li><strong>Collezioni Speciali</strong> - Anteprime dei nuovi pezzi del museo</li>
                                        <li><strong>Offerte del Negozio</strong> - Sconti esclusivi su riproduzioni e libri</li>
                                        <li><strong>Storie Affascinanti</strong> - Racconti dal passato millenario della nostra terra</li>
                                    </ul>
                                </div>
                                
                                <p>Il Museo Zungri custodisce testimonianze uniche della civiltà rupestre calabrese, dalle antiche grotte degli eremiti bizantini ai preziosi reperti che raccontano millenni di storia mediterranea.</p>
                                
                                <div class="cta">
                                    <a href="https://museozungri.it/collezione" style="color: white;">Esplora la Collezione</a>
                                </div>
                                
                                <div class="divider"></div>
                                
                                <p style="font-style: italic; color: #666;">
                                    "La cultura è l'unico bene dell'umanità che, diviso fra tutti, anziché diminuire diventa più grande."
                                    <br><small>— Hans Georg Gadamer</small>
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p><strong>Museo Zungri</strong></p>
                                <p>Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italia</p>
                                <p>
                                    📧 <a href="mailto:info@museozungri.it">info@museozungri.it</a> | 
                                    🌐 <a href="https://museozungri.it">www.museozungri.it</a>
                                </p>
                                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                                    Hai ricevuto questa email perché ti sei iscritto alla nostra newsletter.<br>
                                    <a href="{{unsubscribeLink}}" style="color: #bdc3c7;">Annulla iscrizione</a>
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
🏛️ MUSEO ZUNGRI
Tesori del Patrimonio Culturale Calabrese

Benvenuto nella famiglia del Museo Zungri!

Caro appassionato di storia e cultura,

Grazie di cuore per esserti iscritto alla nostra newsletter! Sei ora parte di una comunità esclusiva che celebra e preserva il ricco patrimonio archeologico e culturale di Zungri e della Calabria.

COSA RICEVERAI:
• Scoperte Archeologiche - Le ultime ricerche e ritrovamenti
• Eventi Esclusivi - Mostre, conferenze e visite guidate  
• Collezioni Speciali - Anteprime dei nuovi pezzi del museo
• Offerte del Negozio - Sconti esclusivi su riproduzioni e libri
• Storie Affascinanti - Racconti dal passato millenario della nostra terra

Il Museo Zungri custodisce testimonianze uniche della civiltà rupestre calabrese, dalle antiche grotte degli eremiti bizantini ai preziosi reperti che raccontano millenni di storia mediterranea.

Esplora la Collezione: https://museozungri.it/collezione

"La cultura è l'unico bene dell'umanità che, diviso fra tutti, anziché diminuire diventa più grande." — Hans Georg Gadamer

---
MUSEO ZUNGRI
Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italia
📧 info@museozungri.it | 🌐 www.museozungri.it

Hai ricevuto questa email perché ti sei iscritto alla nostra newsletter.
Per annullare l'iscrizione: {{unsubscribeLink}}
                `
            },
            en: {
                subject: 'Welcome to Zungri Museum Newsletter! 🏛️',
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to Zungri Museum</title>
                        <style>
                            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; }
                            .header { background: linear-gradient(135deg, #8B5A3C 0%, #A0522D 100%); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
                            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
                            .content { padding: 40px 30px; }
                            .content h2 { color: #8B5A3C; margin-top: 0; font-size: 24px; }
                            .benefits { background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8B5A3C; }
                            .benefits ul { margin: 0; padding-left: 20px; }
                            .benefits li { margin-bottom: 8px; }
                            .cta { text-align: center; margin: 30px 0; }
                            .cta a { background-color: #8B5A3C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
                            .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 14px; }
                            .footer a { color: #ecf0f1; }
                            .divider { height: 1px; background-color: #eee; margin: 30px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏛️ ZUNGRI MUSEUM</h1>
                                <p>Treasures of Calabrian Cultural Heritage</p>
                            </div>
                            
                            <div class="content">
                                <h2>Welcome to the Zungri Museum family!</h2>
                                
                                <p>Dear history and culture enthusiast,</p>
                                
                                <p>Thank you so much for subscribing to our newsletter! You are now part of an exclusive community that celebrates and preserves the rich archaeological and cultural heritage of Zungri and Calabria.</p>
                                
                                <div class="benefits">
                                    <h3 style="color: #8B5A3C; margin-top: 0;">What you'll receive:</h3>
                                    <ul>
                                        <li><strong>Archaeological Discoveries</strong> - Latest research and findings</li>
                                        <li><strong>Exclusive Events</strong> - Exhibitions, conferences and guided tours</li>
                                        <li><strong>Special Collections</strong> - Previews of new museum pieces</li>
                                        <li><strong>Shop Offers</strong> - Exclusive discounts on reproductions and books</li>
                                        <li><strong>Fascinating Stories</strong> - Tales from our land's millenary past</li>
                                    </ul>
                                </div>
                                
                                <p>The Zungri Museum preserves unique testimonies of Calabrian rupestrian civilization, from ancient Byzantine hermit caves to precious artifacts that tell millennia of Mediterranean history.</p>
                                
                                <div class="cta">
                                    <a href="https://museozungri.it/collection" style="color: white;">Explore the Collection</a>
                                </div>
                                
                                <div class="divider"></div>
                                
                                <p style="font-style: italic; color: #666;">
                                    "Culture is the only good of humanity that, when divided among all, instead of diminishing becomes greater."
                                    <br><small>— Hans Georg Gadamer</small>
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p><strong>Zungri Museum</strong></p>
                                <p>Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italy</p>
                                <p>
                                    📧 <a href="mailto:info@museozungri.it">info@museozungri.it</a> | 
                                    🌐 <a href="https://museozungri.it">www.museozungri.it</a>
                                </p>
                                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                                    You received this email because you subscribed to our newsletter.<br>
                                    <a href="{{unsubscribeLink}}" style="color: #bdc3c7;">Unsubscribe</a>
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
🏛️ ZUNGRI MUSEUM
Treasures of Calabrian Cultural Heritage

Welcome to the Zungri Museum family!

Dear history and culture enthusiast,

Thank you so much for subscribing to our newsletter! You are now part of an exclusive community that celebrates and preserves the rich archaeological and cultural heritage of Zungri and Calabria.

WHAT YOU'LL RECEIVE:
• Archaeological Discoveries - Latest research and findings
• Exclusive Events - Exhibitions, conferences and guided tours
• Special Collections - Previews of new museum pieces  
• Shop Offers - Exclusive discounts on reproductions and books
• Fascinating Stories - Tales from our land's millenary past

The Zungri Museum preserves unique testimonies of Calabrian rupestrian civilization, from ancient Byzantine hermit caves to precious artifacts that tell millennia of Mediterranean history.

Explore the Collection: https://museozungri.it/collection

"Culture is the only good of humanity that, when divided among all, instead of diminishing becomes greater." — Hans Georg Gadamer

---
ZUNGRI MUSEUM
Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italy
📧 info@museozungri.it | 🌐 www.museozungri.it

You received this email because you subscribed to our newsletter.
To unsubscribe: {{unsubscribeLink}}
                `
            }
        };

        return templates[language] || templates.it;
    }

    getConfirmationTemplate(language: string = 'it'): EmailTemplate {
        const templates: Record<string, EmailTemplate> = {
            it: {
                subject: 'Conferma la tua iscrizione al Museo Zungri 🏛️',
                html: `
                    <!DOCTYPE html>
                    <html lang="it">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Conferma Iscrizione</title>
                        <style>
                            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; }
                            .header { background: linear-gradient(135deg, #8B5A3C 0%, #A0522D 100%); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
                            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
                            .content { padding: 40px 30px; text-align: center; }
                            .content h2 { color: #8B5A3C; margin-top: 0; font-size: 24px; }
                            .cta-button { background-color: #8B5A3C; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; margin: 30px 0; transition: background-color 0.3s; }
                            .cta-button:hover { background-color: #A0522D; }
                            .link-fallback { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 14px; }
                            .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 14px; }
                            .footer a { color: #ecf0f1; }
                            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏛️ MUSEO ZUNGRI</h1>
                                <p>Tesori del Patrimonio Culturale</p>
                            </div>
                            
                            <div class="content">
                                <h2>Un ultimo passo per completare l'iscrizione</h2>
                                
                                <p style="font-size: 18px; margin: 30px 0;">Grazie per il tuo interesse nella newsletter del Museo Zungri!</p>
                                
                                <p>Per garantire la sicurezza del tuo indirizzo email e completare l'iscrizione alla nostra newsletter esclusiva, clicca sul pulsante qui sotto:</p>
                                
                                <a href="{{confirmationLink}}" class="cta-button">
                                    ✓ Conferma Iscrizione
                                </a>
                                
                                <p style="margin-top: 30px;">Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
                                
                                <div class="link-fallback">
                                    {{confirmationLink}}
                                </div>
                                
                                <div class="warning">
                                    <strong>⏰ Importante:</strong> Questo link di conferma scadrà tra 24 ore per motivi di sicurezza. Se non confermi entro questo tempo, dovrai iscriverti nuovamente.
                                </div>
                                
                                <p style="color: #666; margin-top: 40px;">
                                    Una volta confermata l'iscrizione, riceverai aggiornamenti esclusivi su:
                                    <br><strong>Scoperte archeologiche • Eventi speciali • Nuove collezioni • Offerte del negozio</strong>
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p><strong>Museo Zungri</strong></p>
                                <p>Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italia</p>
                                <p>📧 <a href="mailto:info@museozungri.it">info@museozungri.it</a></p>
                                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                                    Se non hai richiesto questa iscrizione, puoi tranquillamente ignorare questa email.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
🏛️ MUSEO ZUNGRI
Tesori del Patrimonio Culturale

Un ultimo passo per completare l'iscrizione

Grazie per il tuo interesse nella newsletter del Museo Zungri!

Per garantire la sicurezza del tuo indirizzo email e completare l'iscrizione alla nostra newsletter esclusiva, visita questo link:

{{confirmationLink}}

⏰ IMPORTANTE: Questo link di conferma scadrà tra 24 ore per motivi di sicurezza. Se non confermi entro questo tempo, dovrai iscriverti nuovamente.

Una volta confermata l'iscrizione, riceverai aggiornamenti esclusivi su:
• Scoperte archeologiche 
• Eventi speciali 
• Nuove collezioni 
• Offerte del negozio

---
MUSEO ZUNGRI
Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italia
📧 info@museozungri.it

Se non hai richiesto questa iscrizione, puoi tranquillamente ignorare questa email.
                `
            },
            en: {
                subject: 'Confirm your Zungri Museum subscription 🏛️',
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Confirm Subscription</title>
                        <style>
                            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; }
                            .header { background: linear-gradient(135deg, #8B5A3C 0%, #A0522D 100%); color: white; padding: 40px 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
                            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
                            .content { padding: 40px 30px; text-align: center; }
                            .content h2 { color: #8B5A3C; margin-top: 0; font-size: 24px; }
                            .cta-button { background-color: #8B5A3C; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; margin: 30px 0; transition: background-color 0.3s; }
                            .cta-button:hover { background-color: #A0522D; }
                            .link-fallback { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 14px; }
                            .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 14px; }
                            .footer a { color: #ecf0f1; }
                            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏛️ ZUNGRI MUSEUM</h1>
                                <p>Treasures of Cultural Heritage</p>
                            </div>
                            
                            <div class="content">
                                <h2>One last step to complete your subscription</h2>
                                
                                <p style="font-size: 18px; margin: 30px 0;">Thank you for your interest in the Zungri Museum newsletter!</p>
                                
                                <p>To ensure the security of your email address and complete your subscription to our exclusive newsletter, click the button below:</p>
                                
                                <a href="{{confirmationLink}}" class="cta-button">
                                    ✓ Confirm Subscription
                                </a>
                                
                                <p style="margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser:</p>
                                
                                <div class="link-fallback">
                                    {{confirmationLink}}
                                </div>
                                
                                <div class="warning">
                                    <strong>⏰ Important:</strong> This confirmation link will expire in 24 hours for security reasons. If you don't confirm within this time, you'll need to subscribe again.
                                </div>
                                
                                <p style="color: #666; margin-top: 40px;">
                                    Once you confirm your subscription, you'll receive exclusive updates about:
                                    <br><strong>Archaeological discoveries • Special events • New collections • Shop offers</strong>
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p><strong>Zungri Museum</strong></p>
                                <p>Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italy</p>
                                <p>📧 <a href="mailto:info@museozungri.it">info@museozungri.it</a></p>
                                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                                    If you didn't request this subscription, you can safely ignore this email.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
🏛️ ZUNGRI MUSEUM
Treasures of Cultural Heritage

One last step to complete your subscription

Thank you for your interest in the Zungri Museum newsletter!

To ensure the security of your email address and complete your subscription to our exclusive newsletter, visit this link:

{{confirmationLink}}

⏰ IMPORTANT: This confirmation link will expire in 24 hours for security reasons. If you don't confirm within this time, you'll need to subscribe again.

Once you confirm your subscription, you'll receive exclusive updates about:
• Archaeological discoveries
• Special events
• New collections
• Shop offers

---
ZUNGRI MUSEUM
Via Roma, 123 - 89863 Zungri (VV) - Calabria, Italy
📧 info@museozungri.it

If you didn't request this subscription, you can safely ignore this email.
                `
            }
        };

        return templates[language] || templates.it;
    }
}

export const emailTemplates = new EmailTemplates();
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const notificationClients: Response[] = [];
const messageClients: Response[] = [];

app.use(express.json());
app.use(cors());

app.get('/new-notification', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    notificationClients.push(res);

    req.on('close', () => {
        res.end();
        notificationClients.splice(notificationClients.indexOf(res), 1);
    });
});

app.get('/new-message', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    messageClients.push(res);

    req.on('close', () => {
        res.end();
        messageClients.splice(messageClients.indexOf(res), 1);
    });
});

app.post('/send-notification', (req: Request, res: Response) => {
    const notification = req.body.notification;

    if (notification) {
        for (let client of notificationClients) {
            client.write(`data: ${JSON.stringify({ notification })}\n\n`);
        }
    }

    res.status(200).json({ success: true, message: "Notificación enviada" });
});

app.post('/send-message', (req: Request, res: Response) => {
    const message = req.body.message;

    if (message) {
        for (let client of messageClients) {
            client.write(`data: ${JSON.stringify({ message })}\n\n`);
        }
    }

    res.status(200).json({ success: true, message: "Mensaje enviado" });
});

app.listen(3000, () => console.log("API corriendo en el puerto 3000"));

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const pastaUploads = path.join(__dirname, '../../uploads');

fs.mkdirSync(pastaUploads, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaUploads);
    },

    filename: (req, file, cb) => {
        const extensoes = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        };

        const extensao = extensoes[file.mimetype];

        if (!extensao) {
            return cb(new Error('Formato de imagem inválido.'));
        }

        cb(null, `${crypto.randomUUID()}${extensao}`);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const formatos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!formatos.includes(file.mimetype)) {
            const erro = new Error(
                'Envie uma imagem JPG, PNG ou WEBP.'
            );

            erro.status = 400;

            return cb(erro);
        }

        cb(null, true);
    }
});

module.exports = upload;
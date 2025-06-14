const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        enum: [
            // Gatunki podstawowe
            'Kryminał', 'Fantasy', 'Sci-Fi', 'Horror', 'Romans', 'Biografia', 'Historyczna', 'Przygodowa',

            // Literatura piękna i klasyczna
            'Literatura piękna', 'Klasyka', 'Poezja', 'Dramat', 'Powieść historyczna', 'Literatura modernistyczna',
            'Literatura postmodernistyczna', 'Esej', 'Satyra', 'Literatura faktu',

            // Gatunki popularne
            'Thriller', 'Powieść detektywistyczna', 'Sensacja', 'Romans historyczny', 'Romans paranormalny',
            'Urban fantasy', 'Space opera', 'Dystopia', 'Utopia', 'Cyberpunk', 'Steampunk', 'Postapokaliptyczna',
            'Komedia', 'Tragedia', 'Melodramat', 'Powieść psychologiczna', 'Powieść gotycka',

            // Literatura dla młodzieży i dzieci
            'Young Adult', 'Middle Grade', 'Literatura dziecięca', 'Baśń', 'Bajka', 'Powieść inicjacyjna',
            'Powieść młodzieżowa',

            // Literatura specjalistyczna
            'Reportaż', 'Wspomnienia', 'Autobiografia', 'Pamiętniki', 'Literatura podróżnicza',
            'Literatura religijna', 'Literatura filozoficzna', 'Literatura naukowa', 'Popularnonaukowa',
            'Poradnik', 'Podręcznik',

            // Gatunki niszowe
            'Weird fiction', 'Bizarro fiction', 'Fantastyka slipstream', 'Military sci-fi', 'Hard sci-fi',
            'Soft sci-fi', 'High fantasy', 'Low fantasy', 'Dark fantasy', 'Realizm magiczny',

            // Gatunki narodowe
            'Literatura polska', 'Literatura amerykańska', 'Literatura rosyjska', 'Literatura francuska',
            'Literatura brytyjska', 'Literatura japońska', 'Literatura latynoamerykańska', 'Literatura hiszpańska',

            // Gatunki mieszane
            'Powieść graficzna', 'Komiks', 'Manga', 'Interaktywna fikcja', 'Fanfiction'
        ]
    }],
    productionYear: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed', 'Reserved'],
        default: 'Available'
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    borrowTime: {
        type: Date,
        default: null
    },
    reservationTime: {
        type: Date,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
    reservationExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);

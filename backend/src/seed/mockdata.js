const datefns = require('date-fns');
const courses = {
    language: 'suomi',
    wholecount: 19,
    total: 19,
    prev: null,
    next: null,
    prev_offset: null,
    next_offset: null,
    limit: '0',
    course: [
        {
            id: 1,
            code: 'V172061',
            name: 'English Course',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '86.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 1,
                    start: +datefns.addHours(new Date(), 4),
                    end: +datefns.addHours(new Date(), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 2,
            code: 'V172061',
            name: 'Zumba Class',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '76.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554746,
                    start: +datefns.addHours(datefns.addDays(new Date(), 1), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 1), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 3,
            code: 'V172061',
            name: 'Wine Tasting',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '6.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554749,
                    start: +datefns.addHours(datefns.addDays(new Date(), 2), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 2), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 4,
            code: 'V172061',
            name: 'Moving and Grooving',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '16.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554752,
                    start: +datefns.addHours(datefns.addDays(new Date(), 3), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 3), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 5,
            code: 'V172061',
            name: 'Free Style Swimming',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '26.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554755,
                    start: +datefns.addHours(datefns.addDays(new Date(), 4), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 4), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 6,
            code: 'V172061',
            name: 'Body Workout',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '56.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554758,
                    start: +datefns.addHours(datefns.addDays(new Date(), 5), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 5), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 7,
            code: 'V172061',
            name: 'Cycling',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '61.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554764,
                    start: +datefns.addHours(datefns.addDays(new Date(), 6), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 6), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: '',
                    status: 0,
                },
            ],
        },
        {
            id: 8,
            code: 'V172061',
            name: 'Guitar',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '72.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554767,
                    start: +datefns.addHours(datefns.addDays(new Date(), 7), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 7), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 9,
            code: 'V172061',
            name: 'Learn Russian',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '34.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554770,
                    start: +datefns.addHours(datefns.addDays(new Date(), 1), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 1), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 10,
            code: 'V172061',
            name: 'Dancing',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '26.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554773,
                    start: +datefns.addHours(datefns.addDays(new Date(), 2), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 2), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 11,
            code: 'V172061',
            name: 'Yoga Lesson',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '88.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554776,
                    start: +datefns.addHours(datefns.addDays(new Date(), 3), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 3), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 12,
            code: 'V172061',
            name: 'Ice Hockey',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '10.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554761,
                    start: +datefns.addHours(datefns.addDays(new Date(), 4), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 4), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: '',
                    status: 0,
                },
            ],
        },
        {
            id: 13,
            code: 'V172061',
            name: 'Skiing',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '5.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554779,
                    start: +datefns.addHours(datefns.addDays(new Date(), 5), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 5), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 14,
            code: 'V172061',
            name: 'Summer Party',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '56.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554782,
                    start: +datefns.addHours(datefns.addDays(new Date(), 6), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 6), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 15,
            code: 'V172061',
            name: 'Roller Skating',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '96.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554785,
                    start: +datefns.addHours(datefns.addDays(new Date(), 7), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 7), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 16,
            code: 'V172061',
            name: 'Driving lessons',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '186.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554788,
                    start: +datefns.addHours(datefns.addDays(new Date(), 1), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 1), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 17,
            code: 'V172061',
            name: 'Englantia perustasolla A1+/A2',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '286.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554791,
                    start: +datefns.addHours(datefns.addDays(new Date(), 2), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 2), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 18,
            code: 'V172061',
            name: 'Learn French',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '36.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554794,
                    start: +datefns.addHours(datefns.addDays(new Date(), 3), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 3), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 19,
            code: 'V172061',
            name: 'Spanish Songs',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '55.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554797,
                    start: +datefns.addHours(datefns.addDays(new Date(), 4), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 4), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 20,
            code: 'V172061',
            name: 'Cooking',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '43.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554800,
                    start: +datefns.addHours(datefns.addDays(new Date(), 5), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 5), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 21,
            code: 'V172061',
            name: 'Water sports',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '89.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554803,
                    start: +datefns.addHours(datefns.addDays(new Date(), 6), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 6), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 22,
            code: 'V172061',
            name: 'Shooting',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '81.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554806,
                    start: +datefns.addHours(datefns.addDays(new Date(), 7), 4),
                    end: +datefns.addHours(datefns.addDays(new Date(), 7), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 23,
            code: 'V172061',
            name: 'Designing',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '83.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554809,
                    start: +datefns.addHours(new Date(), 4),
                    end: +datefns.addHours(new Date(), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
        {
            id: 24,
            code: 'V172061',
            name: 'Rowing',
            description: null,
            descriptionInternet: null,
            location: [
                {
                    path: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: '',
                },
            ],
            price: '88.00',
            priceMaterial: '0.00',
            firstSession: 1504512300000,
            firstSessionWeekdate: 'Mon',
            lastSession: 1523865900000,
            internetEnrollment: true,
            minStudentCount: 11,
            maxStudentCount: 25,
            firstEnrollmentDate: 1502877639000,
            lastEnrollmentDate: 1524476100000,
            acceptedCount: -1,
            ilmolink: '',
            teachingSession: [
                {
                    id: 2554812,
                    start: +datefns.addHours(new Date(), 4),
                    end: +datefns.addHours(new Date(), 6),
                    teachingplace: 'Tikkurila, Vantaan opistotalo, 170 Luokka',
                    address: null,
                    description: null,
                    status: 0,
                },
            ],
        },
    ],
};

module.exports = { courses };

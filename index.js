const express = require('express')
const { Pool } = require('pg')
const app = express()
const port = 3000
const cors = require('cors')
const knex = require('./knex/knex.js');

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
    allowedHeaders: ['Content-type', 'Authorization'],
}));
app.use(express.json());

const db = new Pool({
    user: 'corentin',
    password: 'coco11037',
    database: 'ica',
    port: 5433,
})

// routing
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/hook', (req, res) => {
    res.send('içi, les id et hook seront stocké')
})

app.get('/rules', (req, res) => {
    res.send('içi, les id et rules seront stocké')
})

app.get('/adapter', (req, res) => {
    res.send('içi, les id et adapter seront stocké')
})

app.get('/events', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events')
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
})

app.get('/document-type', (req, res) => {
    res.send('içi, les id et les types de document seront stocké')
})

app.get('/erp', (req, res) => {
    res.send('içi, les id et les erp seront stocké')
})

app.get('/client', async (req, res) => {
    try {

        const client = await knex('client').select();

        res.send(client)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
})

app.get('/users', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
})

app.get('/livraison', async (req, res) => {
    try {
        const result = await knex('livraison').select('temps_livraison');
        console.log(result)
        res.json(result)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
})

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require("node:http");
const {verify} = require("jsonwebtoken");
const secretKey = '00YVICAPC11037L';

app.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await db.query('SELECT id_users , email, password FROM users WHERE email = $1', [email]);
        const user = result.rows[0];


        if (result.rows.length === 0) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        console.log('validPassword is: ' + validPassword);
        if (!validPassword) {
            return res.status(400).send('Email ou mot de passe incorrect');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '336h' });
        const userEmail = user.email;

        res.cookie('ica_tk', token, {
            httpOnly: false,
            maxAge: 1209600000, // expire dans 14 jours
            domain: 'localhost',
            path: '/',
            secure: true
        });

        res.cookie('ica_em', userEmail, {
            httpOnly: false,
            maxAge: 1209600000, // expire dans 14 jours
            domain: 'localhost',
            path: '/',
            secure: true
        });

        res.json({message: 'Connexion réussie'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
})

const verifyToken = require('./tokenAuth');

app.post('/form_hook', verifyToken, async (req, res) => {

    try {
        const {
            Purchase_order, Purchase_requisition, Payable_invoice, Payable_credit_note, Sales_invoice, Sales_credit_note,Payable_invoice_PO_based, Other_document,
            hook_name_fr, hook_name_en, hook_name_us, hook_name_es,
            description_fr, description_en, description_us, description_es,
            nom_du_champ, position, event, opening_document_phase, opening_document_step,
            cas_fonctionnel, cas_derreur, resultats_attendus,
            user, phase, etape,
            cas_particulier,
            client, nom_spec, etatSpec
        } = req.body;

        const currentDate = new Date();

        const clientName = knex('client').where('id_client', client).select('name');

        const userEmail = req.user.email;
        const userId = knex('users').where('email', userEmail).select('id_users');

        console.log(hook_name_fr)
        console.log(Purchase_order)

        console.log(req.body);
        console.log(currentDate);

        const documentTypeResult = await knex('document_types')
            .insert({
                other_document: Other_document,
                purchase_order_po: Purchase_order,
                purchase_requisition_pr: Purchase_requisition,
                payable_invoice_nopo: Payable_invoice,
                payable_credit_note_nopo: Payable_credit_note,
                sales_invoice_noso: Sales_invoice,
                sales_credit_note_noso: Sales_credit_note,
                payable_invoice_pobased: Payable_invoice_PO_based,

            })
            .returning('id_document_types');

        const documentTypeId = documentTypeResult[0].id_document_types || documentTypeResult[0];

        const hookResult = await knex('hook').insert({
                name: nom_spec,
                creation_date: currentDate,
                createby: userEmail,
                state: `[${etatSpec}]`,
                id_client: client,
                id_users: userId
            }).returning('id_hook');

        const hookId = hookResult[0].id_hook || hookResult[0];

        const formHookResult = await knex('form_hook').insert({
                nom_du_hook_fr: hook_name_fr,
                nom_du_hook_en: hook_name_en,
                nom_du_hook_us: hook_name_us,
                nom_du_hook_es: hook_name_es,
                description_fr: description_fr,
                description_en: description_en,
                description_us: description_us,
                description_es: description_es,
                event_nom_du_champ: nom_du_champ,
                event_position: position,
                autre_action: event,
                opening_document_phase: opening_document_phase,
                opening_document_step: opening_document_step,
                cas_fonctionnel: cas_fonctionnel,
                cas_erreur: cas_derreur,
                resultats_attendus: resultats_attendus,
                cas_tests_user: user,
                cas_tests_phase: phase,
                cas_tests_etape: etape,
                cas_particulier: cas_particulier,
                client: clientName,
                nom_spec: nom_spec,
                id_client: client,
                id_hook: hookId
            }).returning('id_form_hook');

        const formHookId = formHookResult[0].id_form_hook || formHookResult[0];

        await knex('form_document_type').insert({
            id_document_types: documentTypeId,
            id_form_hook: formHookId
        });

        res.sendStatus(204);
    } catch (error) {
        console.error('Erreur lors de l\'insertion:', error);
        res.status(500).json({ message: 'Erreur lors de l\'insertion des données' });
    }
})

app.get('/list-hook-by-user', verifyToken,  async (req, res) => {
    try {

        const userEmail = req.user.email;

        const listOfHook = await knex('hook')
            .join('users', 'hook.id_users', '=', 'users.id_users')
            .where('users.email', userEmail);
        res.send(listOfHook)
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
});

app.get('/hook/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hookData = await knex('hook')
            .join('form_hook', 'hook.id_hook', '=', 'form_hook.id_hook')
            .where('hook.id_hook', id)
            .select(
                'form_hook.nom_du_hook_fr',
                'form_hook.nom_du_hook_en',
                'form_hook.nom_du_hook_us',
                'form_hook.nom_du_hook_es',
                'form_hook.description_fr',
                'form_hook.description_en',
                'form_hook.description_us',
                'form_hook.description_es',
                'form_hook.event_nom_du_champ',
                'form_hook.event_position',
                'form_hook.autre_action',
                'form_hook.opening_document_phase',
                'form_hook.opening_document_step',
                'form_hook.cas_fonctionnel',
                'form_hook.cas_erreur',
                'form_hook.resultats_attendus',
                'form_hook.cas_tests_user',
                'form_hook.cas_tests_phase',
                'form_hook.cas_tests_etape',
                'form_hook.client',
                'form_hook.nom_spec',
                'form_hook.cas_particulier',
                'hook.state',
            )
            .first();

        console.log(hookData);

        console.log(await knex('form_document_type')
            .join('document_types', 'form_document_type.id_document_types', '=', 'document_types.id_document_types')
            .where('form_document_type.id_form_hook', id)
            .select(
                'document_types.other_document',
                'document_types.purchase_order_po',
                'document_types.purchase_requisition_pr',
                'document_types.payable_invoice_nopo',
                'document_types.payable_credit_note_nopo',
                'document_types.sales_invoice_noso',
                'document_types.sales_credit_note_noso',
                'document_types.payable_invoice_pobased',
            )
            .first())

        if (!hookData) {
            return res.status(404).send('Spécification non trouvée');
        }

        res.json(hookData);
    } catch (error) {
        console.error('Erreur lors du chargement de la spécification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.get('/custom-interop-team', async (req, res) => {
    try{
        const token = req.headers.cookie.split(';').find(row => row.startsWith('ica_tk'))?.split('=')[1];

        const decodedToken = jwt.verify(token, secretKey);
        const userEmail = decodedToken.email;

        const user = await knex('users').where('email', userEmail).first();
        if (user.roles !== 'admin') {
            return res.status(403).json('Vous n\'avez pas accès à cette page');
        }

        res.json(user);
    } catch (error) {
        console.error('Vous n\'avez pas accès a cette page', error);
        res.status(500).json({ message: 'Un problème serveur est survenue' });
    }
});

app.post('/update-livraison', async (req, res) => {
    try {
        const { updateLivraison } = req.body;

        const updateDb = await knex('livraison').where({id_livraison : '1'}).update(
            {
                temps_livraison: updateLivraison
            }
        );

        console.log('Le temps de livraison a bien été mis à jours');

        res.sendStatus(204);
    } catch (error) {
        console.error('Erreur lors de l\'update:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jours du temps de livraison' });
    }
})

app.listen(port, () => {
    console.log(`ICA API listening on port ${port}`)
})


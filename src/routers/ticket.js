const express = require('express');
const { userAuthorization } = require('../middlewares/authorization.middleware');
const { createNewTicketValidation, replyTicketMessageValidation } = require('../middlewares/formValidation.middleware');
const router = express.Router();

const { 
    insertTicket, 
    getTickets, 
    getTicketById, 
    updateClientReply, 
    updateStatusClose,
    deleteTicket } = require('../model/ticket/Ticket.model');



//TODO: Workflow
// + Create url endpoints
// + receive new ticket data
// + authorize every request with JWT
// + Insert in MongoDB
// + Retrive all the tickets for the especific user
// + Retrive a ticket from MongoDB
// + Update message conversation in the ticket database
// + Updare ticket status // close, operator responsive pending, client response pending
// + Delete ticket from MongoDB 

router.all("/", (req, res, next) => {
    // res.json({
    //     message: 'Return from ticket router'
    // });
    next();
});

// - Create New ticket
router.post('/', createNewTicketValidation, userAuthorization, async (req, res) => {
    // - Receive new ticket data

    try {
        const { subject, sender, message } = req.body;
        
        const userId = req.userId; //Sender ID

        const ticketObj = {
            clientId: userId,
            subject,
            conversations: [
                {
                    sender,
                    message,
                },
            ],
        }; 
    
        const result = await insertTicket(ticketObj);
        if(result._id){
            return res.json({ status: 'success', message: 'New ticket has been created!'})
        }
    
        // - Insert in MongoDB
    
        res.json({ status: 'error', message: 'Unable to create the ticket, please try again later'})
    
    } catch (error) {
        res.json({ status: 'error', message: error.message})
    }
});

// - Get all tickets for a specific user
router.get('/', userAuthorization, async (req, res) => {
    try { 
        const userId = req.userId; //Sender ID
    
        // - Insert in MongoDB
        const result = await getTickets(userId);
        if(result.length){
            return res.json({ status: 'success', result})
        }
    
    } catch (error) {
        res.json({ status: 'error', message: error.message})
    }
});


// - Get one ticket for a specific user
router.get('/:_id', userAuthorization, async (req, res) => {
    try { 
        const {_id} = req.params;
        const clientId = req.userId; //Sender ID
    
        // - Insert in MongoDB
        const result = await getTicketById(_id, clientId);
        
        return res.json({ status: 'success', result});

    } catch (error) {
        res.json({ status: 'error', message: error.message})
    }
});


// - Update reply message from client
router.put('/:_id', replyTicketMessageValidation, userAuthorization, async (req, res) => {
    try { 
        const {message, sender} = req.body;
        const {_id} = req.params; // Ticket Id
        const clientId = req.userId;
    
        const result = await updateClientReply({_id, message, sender});
        if(result._id){
            return res.json({ status: 'success', message: 'Your message has been updated'})
        }

        res.json({ status: 'error', message: 'Unable to update your message, please try again later'})
    
    } catch (error) {
        res.json({ status: 'error', message: error.message})
    }
});


// - Update ticket status to close
router.patch('/close-ticket/:_id', userAuthorization, async (req, res) => {
    try { 
        const {_id} = req.params; // Ticket Id
        const clientId = req.userId;
    
        const result = await updateStatusClose({_id, clientId});
        if(result._id){
            return res.json({ status: 'success', message: 'The ticket has been closed'})
        }

        res.json({ status: 'error', message: 'Unable to update the ticket'})
    
    } catch (error) {
        res.json({ status: 'error', message: error.message})
    }
});

// - Delete a ticket
router.delete('/:_id', userAuthorization, async (req, res) => {
    try { 
        const {_id} = req.params; // Ticket Id
        const clientId = req.userId;
    
        const result = await deleteTicket({_id, clientId});
        return res.json({ status: 'success', message: 'The ticket has been deleted'})
      
    } catch (error) {
        res.json({ status: 'error', message: error.message})
    }
});


module.exports = router;
const Contact = require('../models/contactModel');

const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

const addContact = async (req, res) => {
  const newContact = new Contact(req.body);
  const saved = await newContact.save();
  res.status(201).json(saved);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deleted = await Contact.findByIdAndDelete(id);
  if (deleted) {
    res.json({ message: 'Contact deleted' });
  } else {
    res.status(404).json({ error: 'Contact not found' });
  }
};

module.exports = {
  getContacts,
  addContact,
  deleteContact
};

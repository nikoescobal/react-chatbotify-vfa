import React, { useRef } from 'react';
import ChatBot, { Params } from 'react-chatbotify';
import validator from 'validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface FormState {
  services?: string[];
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const MyChatBot = () => {
  const [form, setForm] = React.useState<FormState>({});
  const formRef = useRef<FormState>({});

  // Update the ref whenever the form state changes
  React.useEffect(() => {
    formRef.current = form;
  }, [form]);

  const flow = {
    start: {
      message:
        'Welcome to Venture Freight Australia! How can I help you today?',
      path: 'ask_service_selection',
    },
    ask_service_selection: {
      message: 'Please choose the required services:',
      checkboxes: {
        items: [
          'Worldwide Air & Sea Freight',
          'Licensed Customs Brokerage',
          'Door-to-door Transportation',
          'Overdimensional Cargo',
          'Coastal Shipping',
          'Trade Documents Consultation',
          'Warehousing Services',
        ],
        min: 1,
        max: 7,
        sendOutput: true,
      },
      chatDisabled: true,
      function: (params: Params) => {
        let selectedServices = params.userInput;

        // Ensure selectedServices is an array
        if (typeof selectedServices === 'string') {
          selectedServices = selectedServices
            .split(',')
            .map((item) => item.trim());
        }

        const newForm = { ...formRef.current, services: selectedServices };
        setForm(newForm);
        formRef.current = newForm;
        console.log('Updated formRef.current:', formRef.current);
      },
      path: async (params: Params) => {
        const selectedServices = formRef.current.services;
        if (!Array.isArray(selectedServices) || selectedServices.length < 1) {
          await params.injectMessage('Please select at least one service.');
          return;
        }
        return 'ask_name';
      },
    },
    ask_name: {
      message: 'Please enter your full name:',
      function: (params: Params) => {
        const newForm = { ...formRef.current, name: params.userInput };
        setForm(newForm);
        formRef.current = newForm;
        console.log('Updated formRef.current:', formRef.current);
      },
      path: async (params: Params) => {
        const name = params.userInput.trim();
        if (name.split(' ').length < 2) {
          await params.injectMessage(
            'Please enter your full name (first and last name).'
          );
          return;
        }
        return 'ask_email';
      },
    },
    ask_email: {
      message: 'Please enter your email address:',
      function: (params: Params) => {
        const newForm = { ...formRef.current, email: params.userInput };
        setForm(newForm);
        formRef.current = newForm;
        console.log('Updated formRef.current:', formRef.current);
      },
      path: async (params: Params) => {
        const email = params.userInput;
        if (!validator.isEmail(email)) {
          await params.injectMessage('Please enter a valid email address.');
          return;
        }
        return 'ask_phone';
      },
    },
    ask_phone: {
      message: 'Please enter your phone number (include country code):',
      function: (params: Params) => {
        const newForm = { ...formRef.current, phone: params.userInput };
        setForm(newForm);
        formRef.current = newForm;
        console.log('Updated formRef.current:', formRef.current);
      },
      path: async (params: Params) => {
        const phoneNumber = parsePhoneNumberFromString(params.userInput);
        if (!phoneNumber || !phoneNumber.isValid()) {
          await params.injectMessage(
            'Please enter a valid international phone number.'
          );
          return;
        }
        return 'ask_message';
      },
    },
    ask_message: {
      message: 'Please enter your message (optional):',
      function: (params: Params) => {
        const newForm = { ...formRef.current, message: params.userInput };
        setForm(newForm);
        formRef.current = newForm;
        console.log('Updated formRef.current:', formRef.current);
      },
      path: 'end',
    },
    end: {
      message:
        'Thank you for the details. Our sales team will reach out to you shortly!',
      function: async (_params: Params) => {
        const latestForm = formRef.current;
        console.log('Form data at submission:', latestForm);

        // Ensure services is an array before sending
        if (!Array.isArray(latestForm.services)) {
          console.error('Services should be an array', latestForm.services);
          return;
        }

        try {
          const response = await fetch('http://localhost:5001/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(latestForm),
          });
          console.log('Data being sent to backend:', latestForm);

          if (!response.ok) {
            console.error('Error submitting form data:', response.statusText);
            return;
          }

          const responseData = await response.text();
          console.log('Backend response:', responseData);
        } catch (error) {
          console.error('Error submitting form data:', error);
        }
      },
      options: ['Start Over'],
      path: 'start',
    },
  };

  return (
    <ChatBot
      settings={{
        general: { embedded: true },
        header: { title: 'Venture Freight Australia' },
        chatHistory: { storageKey: 'example_complex_form' },
      }}
      flow={flow}
    />
  );
};

export default MyChatBot;

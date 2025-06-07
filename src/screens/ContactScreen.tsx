import React, { useState } from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import tw from 'twrnc';
import { Send, User, Mail, MessageSquare as MessageIcon } from 'lucide-react-native'; // Icons

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // TODO: Implement actual email sending logic (e.g., via backend or mailto link)
  const handleSendMessage = () => {
    if (!name || !email || !message) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    console.log(`Enviar mensagem de: ${name} (${email}) - Mensagem: ${message}`);
    // Example using mailto (opens email client)
    const subject = encodeURIComponent("Contato via App Dentefier");
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
    const mailtoUrl = `mailto:contato@dentefier.example.com?subject=${subject}&body=${body}`;
    
    Linking.openURL(mailtoUrl).catch(err => {
        console.error("Não foi possível abrir o cliente de e-mail", err);
        Alert.alert("Erro", "Não foi possível abrir seu aplicativo de e-mail. Verifique suas configurações.");
    });

    // Clear form after attempting to send
    // setName('');
    // setEmail('');
    // setMessage('');
    Alert.alert("Sucesso", "Sua mensagem foi preparada para envio no seu app de e-mail.");
  };

  return (
    <ScrollView style={tw`flex-1 bg-black p-4`}>
      <Card style={tw`mb-6 bg-gray-900`}>
        <Card.Content>
          <Title style={tw`text-yellow-500 text-lg mb-2`}>Entre em Contato</Title>
          <Paragraph style={tw`text-gray-300 mb-4`}>
            Tem alguma dúvida, sugestão ou precisa de suporte? Preencha o formulário abaixo.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={tw`bg-gray-900 p-4`}>
        <View style={tw`mb-4`}>
          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={tw`bg-gray-800`}
            textColor={tw.color('white')}
            theme={{ colors: { primary: tw.color('yellow-500'), outline: 'gray', text: 'white', placeholder: 'gray' } }}
            left={<TextInput.Icon icon={() => <User color={tw.color('gray-400')} size={20} />} />}
          />
        </View>

        <View style={tw`mb-4`}>
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={tw`bg-gray-800`}
            textColor={tw.color('white')}
            theme={{ colors: { primary: tw.color('yellow-500'), outline: 'gray', text: 'white', placeholder: 'gray' } }}
            left={<TextInput.Icon icon={() => <Mail color={tw.color('gray-400')} size={20} />} />}
          />
        </View>

        <View style={tw`mb-6`}>
          <TextInput
            label="Mensagem"
            value={message}
            onChangeText={setMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={tw`bg-gray-800 h-32`}
            textColor={tw.color('white')}
            theme={{ colors: { primary: tw.color('yellow-500'), outline: 'gray', text: 'white', placeholder: 'gray' } }}
            left={<TextInput.Icon icon={() => <MessageIcon color={tw.color('gray-400')} size={20} />} />}
          />
        </View>

        <Button 
          icon={() => <Send color={tw.color('black')} size={20} />} 
          mode="contained" 
          onPress={handleSendMessage} 
          style={tw`bg-yellow-500 py-1`}
          labelStyle={tw`text-black font-bold text-lg`}
        >
          Enviar Mensagem
        </Button>
      </Card>

    </ScrollView>
  );
};

export default ContactScreen;


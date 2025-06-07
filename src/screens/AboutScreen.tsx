import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar } from 'react-native-paper';
import tw from 'twrnc';
import { Github, Linkedin, Mail } from 'lucide-react-native'; // Icons

const AboutScreen = () => {

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={tw`flex-1 bg-black p-4`}>
      <Card style={tw`mb-6 bg-gray-900`}>
        <Card.Content>
          <Title style={tw`text-yellow-500 text-lg mb-2`}>Sobre o Dentefier</Title>
          <Paragraph style={tw`text-gray-300 mb-4`}>
            Dentefier é uma aplicação de auxílio à odontologia forense desenvolvida como parte do curso TADS035.
            O objetivo é fornecer uma ferramenta para análise e comparação de radiografias dentárias para fins de identificação.
          </Paragraph>
          <Paragraph style={tw`text-gray-400 text-xs`}>
            Versão: 1.0.0 (React Native)
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={tw`mb-6 bg-gray-900`}>
        <Card.Content>
          <Title style={tw`text-yellow-500 text-lg mb-3`}>Desenvolvedor</Title>
          <View style={tw`flex-row items-center mb-4`}>
            <Avatar.Text size={48} label="DV" style={tw`bg-yellow-600 mr-4`} />
            <View>
              <Text style={tw`text-white text-base font-semibold`}>Seu Nome Aqui</Text>
              <Text style={tw`text-gray-400 text-sm`}>Desenvolvedor Full Stack</Text>
            </View>
          </View>
          <View style={tw`flex-row justify-start gap-4`}>
            <Button icon={() => <Github color={tw.color('gray-400')} size={20} />} onPress={() => openLink('https://github.com/')} compact textColor={tw.color('gray-400')}>GitHub</Button>
            <Button icon={() => <Linkedin color={tw.color('gray-400')} size={20} />} onPress={() => openLink('https://linkedin.com/')} compact textColor={tw.color('gray-400')}>LinkedIn</Button>
            <Button icon={() => <Mail color={tw.color('gray-400')} size={20} />} onPress={() => openLink('mailto:seuemail@example.com')} compact textColor={tw.color('gray-400')}>Email</Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={tw`bg-gray-900`}>
        <Card.Content>
          <Title style={tw`text-yellow-500 text-lg mb-3`}>Tecnologias Utilizadas</Title>
          <Paragraph style={tw`text-gray-300`}>- React Native</Paragraph>
          <Paragraph style={tw`text-gray-300`}>- Expo</Paragraph>
          <Paragraph style={tw`text-gray-300`}>- TypeScript</Paragraph>
          <Paragraph style={tw`text-gray-300`}>- React Navigation</Paragraph>
          <Paragraph style={tw`text-gray-300`}>- React Native Paper</Paragraph>
          <Paragraph style={tw`text-gray-300`}>- twrnc (Tailwind-like styling)</Paragraph>
          <Paragraph style={tw`text-gray-300`}>- Lucide Icons</Paragraph>
        </Card.Content>
      </Card>

    </ScrollView>
  );
};

export default AboutScreen;


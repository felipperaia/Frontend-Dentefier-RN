import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import tw from 'twrnc';
import { UploadCloud, Camera } from 'lucide-react-native'; // Icons

const IdentificationScreen = () => {
  // TODO: Implement image selection/capture logic
  const handleSelectImage = () => {
    console.log("Selecionar imagem da galeria");
    // Add logic using Expo Image Picker
  };

  const handleCaptureImage = () => {
    console.log("Capturar imagem com a câmera");
    // Add logic using Expo Camera
  };

  const handleStartIdentification = () => {
    console.log("Iniciar processo de identificação");
    // Add logic to process the image and call backend/analysis
  };

  return (
    <ScrollView style={tw`flex-1 bg-black p-4`}>
      <Card style={tw`mb-6 bg-gray-900`}>
        <Card.Content>
          <Title style={tw`text-yellow-500 text-lg mb-2`}>Identificação Odontológica</Title>
          <Paragraph style={tw`text-gray-300 mb-4`}>
            Selecione uma radiografia panorâmica ou tire uma foto para iniciar a análise e identificação.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Placeholder for Image Preview */}
      <View style={tw`h-48 bg-gray-800 rounded-lg mb-6 justify-center items-center border border-dashed border-gray-600`}>
        <Text style={tw`text-gray-500`}>Pré-visualização da Imagem</Text>
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-around mb-6`}>
        <Button 
          icon={() => <UploadCloud color={tw.color('yellow-500')} size={20} />} 
          mode="contained" 
          onPress={handleSelectImage} 
          style={tw`bg-gray-800 flex-1 mx-1`}
          labelStyle={tw`text-yellow-500 text-sm`}
        >
          Galeria
        </Button>
        <Button 
          icon={() => <Camera color={tw.color('yellow-500')} size={20} />} 
          mode="contained" 
          onPress={handleCaptureImage} 
          style={tw`bg-gray-800 flex-1 mx-1`}
          labelStyle={tw`text-yellow-500 text-sm`}
        >
          Câmera
        </Button>
      </View>

      <Button 
        mode="contained" 
        onPress={handleStartIdentification} 
        style={tw`bg-yellow-500 py-2`}
        labelStyle={tw`text-black font-bold text-base`}
        // disabled={!imageSelected} // Enable when image selection logic is added
      >
        Iniciar Identificação
      </Button>

    </ScrollView>
  );
};

export default IdentificationScreen;


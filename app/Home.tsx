import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { parse } from 'papaparse';
import * as FileSystem from 'expo-file-system';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permiso requerido',
            'Se necesitan permisos de acceso al almacenamiento para usar esta función.'
          );
        }
      }
    };

    requestPermissions();
  }, []);

  const handleCSVUpload = async () => {
    try {
      setLoading(true);
      console.log('Iniciando la selección de archivo CSV...');

      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      console.log('Resultado de la selección de archivo:', result);

      if (!result.canceled) {
        if (Platform.OS === 'web') {
          const file = result.output[0];
          console.log('Archivo seleccionado:', file);

          const reader = new FileReader();

          reader.onload = async (event) => {
            const fileContent = event.target.result;
            console.log('Contenido del archivo CSV:', fileContent);

            // Parseamos el contenido del CSV
            const parsedData = await parseCSVContent(fileContent);
            console.log('Datos parseados desde parseCSVContent:', parsedData);

            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setData(parsedData);
            } else {
              Alert.alert('Información', 'No se encontraron datos en el archivo.');
            }

            setLoading(false);
          };

          reader.onerror = (error) => {
            Alert.alert('Error', `Error al leer el archivo: ${error.message}`);
            console.error('Error al leer el archivo:', error);
            setLoading(false);
          };

          reader.readAsText(file);
        } else {
          const fileUri = result.uri;
          console.log('Archivo seleccionado URI:', fileUri);

          const parsedData = await readCSV(fileUri);
          console.log('Datos parseados desde readCSV:', parsedData);

          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setData(parsedData);
          } else {
            Alert.alert('Información', 'No se encontraron datos en el archivo.');
          }

          setLoading(false);
        }
      } else {
        Alert.alert('Información', 'No se seleccionó ningún archivo.');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', `Error al seleccionar el archivo: ${error.message}`);
      console.error('Error en handleCSVUpload:', error);
      setLoading(false);
    }
  };

  const parseCSVContent = async (fileContent) => {
    return new Promise((resolve, reject) => {
      parse(fileContent, {
        header: true,
        delimiter: ';',
        complete: (results) => {
          console.log('Resultados del parseo:', results.data);
          resolve(results.data);
        },
        error: (error) => {
          console.error('Error en el parseo:', error);
          reject(error);
        },
      });
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <Button title="SUBIR CSV" onPress={handleCSVUpload} />
      {loading && <Text>Cargando archivo...</Text>}
      <ScrollView style={{ marginTop: 20 }}>
        {data.length > 0 ? (
          data.slice(0, 10).map((item, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>Centro: {item.CENTRO}</Text>
              <Text>Paciente: {item.PACIENTE}</Text>
              <Text>Medicamento: {item.DESC_MEDICAMENTO}</Text>
              <Text>Hora Despacho: {item.HORA_DESPACHO}</Text>
              <Text>Fecha Despacho: {item.FECHA_DESPACHO}</Text>
            </View>
          ))
        ) : (
          !loading && <Text style={{ color: 'black' }}>No se ha cargado ningún archivo.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

// Home.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { parse } from 'papaparse';
import { readCSV } from '../utils/readCSV'; // Asegúrate de que la ruta es correcta

const Home = () => {
  const [data, setData] = useState<any[]>([]);
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
      console.log('Resultado de la selección de archivo:', JSON.stringify(result, null, 2));

      if (!result.canceled) {
        if (Platform.OS === 'web') {
          const file = result.output[0];
          console.log('Archivo seleccionado:', file);

          const reader = new FileReader();

          reader.onload = async (event: any) => {
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
          let fileUri = null;

          if (result.uri) {
            fileUri = result.uri;
          } else if (result.assets && result.assets.length > 0) {
            fileUri = result.assets[0].uri;
          }

          if (fileUri) {
            console.log('Archivo seleccionado URI:', fileUri);
            const parsedData = await readCSV(fileUri);
            console.log('Datos parseados desde readCSV:', parsedData);

            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setData(parsedData);
            } else {
              Alert.alert('Información', 'No se encontraron datos en el archivo.');
            }
          } else {
            Alert.alert('Error', 'No se pudo obtener el URI del archivo.');
          }

          setLoading(false);
        }
      } else {
        Alert.alert('Información', 'No se seleccionó ningún archivo.');
        setLoading(false);
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al seleccionar el archivo: ${error.message}`);
      console.error('Error en handleCSVUpload:', error);
      setLoading(false);
    }
  };

  const parseCSVContent = async (fileContent: string) => {
    return new Promise<any[]>((resolve, reject) => {
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
              <Text>DNI: {item.DNI}</Text>
              <Text>Paciente: {item.PACIENTE}</Text>
              <Text>Medicamento: {item.DESC_MEDICAMENTO}</Text>
              <Text>Cantidad de medicamento atendida: {item.CANT_ATENDIDA}</Text>
              <Text>Cantidad de medicamento solicitada: {item.CANT_SOLICITUD}</Text>
              <Text>Unidad: {item.UNIDAD}</Text>
              <Text>Duración del tratamiento: {item.DIAS}</Text>
              <Text>Fecha de despacho: {item.FECHA_DESPACHO}</Text>
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

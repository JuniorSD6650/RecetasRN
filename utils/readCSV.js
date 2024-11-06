import { parse } from 'papaparse';
import * as FileSystem from 'expo-file-system';

export const readCSV = async (uri) => {
  try {
    // Leer el archivo CSV como texto
    const fileContent = await FileSystem.readAsStringAsync(uri);
    console.log('Contenido del archivo CSV:', fileContent); // Ver contenido del archivo

    return new Promise((resolve, reject) => {
      parse(fileContent, {
        header: true,
        delimiter: ';', // Usa el delimitador correcto
        complete: (results) => {
          console.log('Resultados del parseo:', results.data); // Ver los resultados del parseo
          resolve(results.data);
        },
        error: (error) => {
          console.error('Error en el parseo:', error); // Manejar errores de parseo
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error al leer el archivo:', error); // Manejar errores al leer el archivo
    throw error;
  }
};

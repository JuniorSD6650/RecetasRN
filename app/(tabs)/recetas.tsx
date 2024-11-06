import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Importa el JSON localmente
import recetasData from '../temp.json';

export default function Recetas() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Aquí se simula la carga de datos desde el archivo JSON
        setData(recetasData);
    }, []);

    // Renderiza cada receta en un formato más visualmente organizado
    const renderReceta = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Paciente: {item.Paciente}</Text>
            <Text>DNI: {item.DNI}</Text>
            <Text>Medicamento: {item.Medicamento}</Text>
            <Text>Cantidad solicitada: {item.Cantidad_solicitada}</Text>
            <Text>Cantidad atendida: {item.Cantidad_atendida}</Text>
            <Text>Unidad:{item.Unidad}</Text>
            <Text>Duración del tratamiento: {item.Duracion_tratamiento} días</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderReceta}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

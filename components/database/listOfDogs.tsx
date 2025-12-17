import { getMyDogs } from '@/src/services/dogService';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ListOfDogs() {
    const [status, setStatus] = useState<string | null>(null)
    const [dogs, setDogs] = useState<any[]>([])

    useEffect(() => {
        loadDogs()
    }, [])

    // Funktio koirien lataamiseen käyttäjälle 
    // Tullaan käyttämään vain käyttäjän omassa profiilissa
    const loadDogs = async () => {
        setStatus('Ladataan koiria...')
        try {
            const list = await getMyDogs()
            setDogs(list)
            setStatus(null)
        } catch (e: any) {
            console.error(e)
            setStatus(`Koirien lataus epäonnistui: ${e?.message ?? e}`)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Koirat</Text>

            {/* Lista koirista */}
            {dogs.length === 0 ? <Text style={styles.empty}>Ei koiria</Text> : dogs.map(d => (
                <View key={d.id} style={styles.item}>
                    <Text style={styles.itemTitle}>{d.name} - {d.breed}</Text>
                    <Text style={styles.itemMeta}>Ikä: {d.age} vuotta</Text>
                    <Text style={styles.itemMeta}>Terveyskartoitus: {d.healthAssessmentDone ? 'Valmis' : 'Ei tehty'}</Text>
                    <Text style={styles.itemMeta}>{d.description}</Text>
                </View>
            ))}

            {/* Päivitysnappi listalle */}
            <TouchableOpacity style={[styles.button]} onPress={() => { loadDogs(); }}>
                <Text style={styles.buttonText}>Päivitä koiralista</Text>
            </TouchableOpacity>

            {status && <Text style={styles.status}>{status}</Text>}
        </View>
    )
}



const styles = StyleSheet.create({
    container: { 
        flex: 1,
        width: '90%',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff3c0ff',
    },
    sectionTitle: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: '700'
    },
    empty: {
        color: '#666',
        marginTop: 6
    },
    item: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#fff9e6',
        width: '100%',
        borderRadius: 8
    },
    itemTitle: {
        fontWeight: '700'
    },
    itemMeta: {
        color: '#666'
    },
    status: {
        marginTop: 12,
        color: '#333'
    },
    button: { 
        marginTop: 6,
        backgroundColor: '#206b00ff', 
        padding: 12, 
        borderRadius: 8,
        marginBottom: 6
    },
    buttonText: {
        color: '#fff', 
        fontWeight: '600' 
    },
})
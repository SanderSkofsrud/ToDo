// components/NewListModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
} from 'react-native';

interface NewListModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (listName: string) => void;
}

const NewListModal: React.FC<NewListModalProps> = ({ visible, onClose, onCreate }) => {
    const [text, setText] = useState('');

    const handleCreate = () => {
        const trimmedText = text.trim();
        if (trimmedText.length > 0) {
            onCreate(trimmedText);
            setText('');
        }
    };

    const handleClose = () => {
        setText('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>New List</Text>
                        <TextInput
                            placeholder="Enter new list name"
                            value={text}
                            onChangeText={setText}
                            style={styles.input}
                            autoFocus
                            returnKeyType="done"
                            onSubmitEditing={handleCreate}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Cancel" onPress={handleClose} />
                            <Button title="Create" onPress={handleCreate} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default NewListModal;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

// app/components/Base/ConfirmationDialog.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../styles/theme';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: (event: GestureResponderEvent) => void;
  onCancel: (event: GestureResponderEvent) => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                 visible,
                                                                 title,
                                                                 message,
                                                                 onConfirm,
                                                                 onCancel,
                                                               }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Avbryt"
            >
              <Text style={styles.cancelButtonText}>Avbryt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Slett"
            >
              <Text style={styles.confirmButtonText}>Slett</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: Colors.gray[800],
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  message: {
    fontSize: FontSizes.medium,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.large,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.small,
    marginHorizontal: Spacing.small,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[700],
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: Colors.text,
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
});

export default ConfirmationDialog;

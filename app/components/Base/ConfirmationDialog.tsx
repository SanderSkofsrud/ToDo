import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Spacing, FontSizes, BorderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props for the ConfirmationDialog component.
 */
interface ConfirmationDialogProps {
  /** Controls the visibility of the modal */
  visible: boolean;
  /** Title text displayed at the top of the dialog */
  title: string;
  /** Message text displayed below the title */
  message: string;
  /** Callback function invoked when the confirm button is pressed */
  onConfirm: (event: GestureResponderEvent) => void;
  /** Callback function invoked when the cancel button is pressed */
  onCancel: (event: GestureResponderEvent) => void;
}

/**
 * A modal dialog for confirming actions like deletions.
 * @param visible - Determines if the modal is visible.
 * @param title - The title of the dialog.
 * @param message - The message content of the dialog.
 * @param onConfirm - Function to call on confirmation.
 * @param onCancel - Function to call on cancellation.
 * @returns A React functional component.
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                 visible,
                                                                 title,
                                                                 message,
                                                                 onConfirm,
                                                                 onCancel,
                                                               }) => {
  const { theme } = useTheme();

  /**
   * Generates styles based on the current theme.
   * @param theme - The current theme object.
   * @returns A StyleSheet object.
   */
  const getStyles = (theme: any) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      dialogContainer: {
        width: '80%',
        backgroundColor: theme.background,
        borderRadius: BorderRadius.medium,
        padding: Spacing.medium,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      title: {
        fontSize: FontSizes.large,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: Spacing.small,
      },
      message: {
        fontSize: FontSizes.medium,
        color: theme.text,
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
        backgroundColor: theme.gray[700],
      },
      confirmButton: {
        backgroundColor: theme.primary,
      },
      cancelButtonText: {
        color: theme.text,
        fontSize: FontSizes.medium,
        fontWeight: '600',
      },
      confirmButtonText: {
        color: theme.text,
        fontSize: FontSizes.medium,
        fontWeight: '600',
      },
    });

  const styles = getStyles(theme);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
      accessibilityViewIsModal
      accessibilityLabel="Confirmation Dialog"
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
              accessibilityLabel="Cancel"
              accessibilityHint="Cancels the action"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Confirm"
              accessibilityHint="Confirms the action"
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ConfirmationDialog);

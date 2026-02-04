import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import KeyEvent from 'react-native-keyevent';

const useKeyboardShortcuts = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    KeyEvent.onKeyDownListener((keyEvent) => {
      console.log('Tecla presionada:', keyEvent.pressedKey);

      if (keyEvent.ctrlKey && keyEvent.pressedKey === 's') {
        Alert.alert('Atajo Detectado', 'Has presionado Ctrl + S');
      }
      if (keyEvent.ctrlKey && keyEvent.pressedKey === 'c') {
        Alert.alert('Atajo Detectado', 'Has presionado Ctrl + C');
      }
    });

    return () => {
      KeyEvent.removeKeyDownListener();
    };
  }, []);
};

export default useKeyboardShortcuts;

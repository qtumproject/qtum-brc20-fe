import { numberInputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const {
  definePartsStyle,
  defineMultiStyleConfig
} = createMultiStyleConfigHelpers(numberInputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    borderColor: "#E7E7E1",
    h: '56px',
    borderRadius: '12px',
    _dark: {
      borderColor: 'rgba(73, 78, 91, 0.50)',
    }
  },
});

export const numberInputTheme = defineMultiStyleConfig({
  baseStyle
});
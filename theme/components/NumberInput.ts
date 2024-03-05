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
    borderRadius: '12px'
  },
  stepper: {
    color: "purple.500",
    background: "gray.200",
    borderRadius: '6px',
    mr: '2px'
  }
});

export const numberInputTheme = defineMultiStyleConfig({
    baseStyle
});
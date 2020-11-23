import colors from "./colors";
import { Platform } from 'react-native';
export default {
    CommonStyles: {
        center_portion: { alignItems: 'center', justifyContent: 'center', },
        full_flex: { flex: 1 },
        SafeAreaStyle: { height: 20, backgroundColor: '#202335' },
        header_container: {
            height: 50,
            alignItems: "center",
            backgroundColor: colors.THEME_BLUE,
            flexDirection: "row",
            justifyContent: "space-between",
            borderWidth: 0,
            paddingTop: Platform.OS == 'ios' ? -15 : 0,
        },
        ButtonBorderStyle: { borderRadius: 25, }
    },
}
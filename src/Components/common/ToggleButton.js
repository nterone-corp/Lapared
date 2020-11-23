
import { View, TouchableOpacity,StyleSheet, Image , Dimensions} from "react-native"
import React from "react"
const { height, width } = Dimensions.get('window');

const ToggleButton = (props) =>{
    let {selected, onTogglePress} = props;
return(<TouchableOpacity onPress={()=>{(onTogglePress(!selected))}}>
        <Image
                style={styles.toggleIcon}
                source={ selected ? require('../../assests/image/On.png') : require('../../assests/image/off.png')}
            />
</TouchableOpacity>)
}



const styles = StyleSheet.create({
   
    toggleIcon: {
        width: width*.10,
        height: width*.10,
    },

})
export default ToggleButton;

import Background from './Background';
import LayoutShape from './LayoutShape';
import PeekingLimit from './PeekingLimit';
import Rounds from './Rounds';
import Symbols from './Symbols';
import TileDimensions from './TileDimensions';
import Time from './Time';

export default function OptionDisplay({optionDisplay}) {
    let display;

    switch (optionDisplay) {
        case 'background':
            display = 
                <>
                    <Background />
                </>

            break;
            

        case 'layout_shape':
            display = 
                <>
                    <LayoutShape />
                </>

            break;
            

        case 'peeking_limit':
            display = 
                <>
                    <PeekingLimit />
                </>

            break;
            

        case 'rounds':
            display = 
                <>
                    <Rounds />
                </>

            break;
            

        case 'symbols':
            display = 
                <>
                    <Symbols />
                </>

            break;
            
            
        case 'tile_dimensions':
            display = 
                <>
                    <TileDimensions />
                </>

            break;
            

        case 'time':
            display = 
                <>
                    <Time />
                </>

            break;
            
    }

    return (
        <div>
            {display}
        </div>
    )
}
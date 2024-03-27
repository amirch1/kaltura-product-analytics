import React, {ReactNode} from 'react';
import './AreaBlocker.css';

interface Props {
    loading: Boolean,
    children: ReactNode
}

function AreaBlocker (props: Props) {
    return (
        <>
            {props.children}
            {props.loading ?
                <div className="areaBlocker">
                    <div className="spinner-container">
                        <div className="spinner">
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
                : null}
        </>
    )
}

export default AreaBlocker;

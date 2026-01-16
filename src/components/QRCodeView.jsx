import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeView = ({ data }) => {
    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-xl border border-indigo-500/20">
            <div className="p-2 bg-white rounded-lg">
                <QRCodeSVG
                    value={data}
                    size={160}
                    level="H"
                    fgColor="#6366f1"
                    includeMargin={false}
                />
            </div>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center">Scan to Sync this Device</p>
        </div>
    );
};

export default QRCodeView;

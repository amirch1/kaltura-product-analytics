import React, {useEffect, useState} from 'react';
import './Filter.css';
import allFeatures from './features.json';
import {Stack} from "@mui/material";
import {Checkbox, Dropdown, MenuItem} from "@kaltura/ds-react-bits";
import {analyticsConfig} from "../../configuration/analytics-config";
import {ChevronDown24Icon, ChevronUp24Icon} from "@kaltura/ds-react-icons";

interface FilterProps {
    onFilterChange: (updatedFilter: {apps: string, verticals: string, feature: string}) => void
}

function Filter(props: FilterProps) {
    const {onFilterChange} = props;
    const [selectedApps, setSelectedApps] = useState('');
    const [selectedVerticals, setSelectedVerticals] = useState('');

    const [open, setOpen] = useState(true);
    const [apps, setApps] = useState({
        "KMC": false, "KMS": false, "Analytics": false, "KME": false, "EP": false,
        "KAF": false, "Webcasting": false, "KPF": false, "Studio": false, "Player": false
    });
    const onAppChange = (event: any) => {
        let newApps: any = {...apps};
        newApps[event.target.value] = event.target.checked;
        setFeature('');
        setApps(newApps);
    }
    useEffect(() => {
        let updatedFeatures: any[] = [{
            "value": "",
            "label": "None"
        }];
        Object.keys(apps).forEach(app =>{
            if ((apps as any)[app] === true && (allFeatures as any)[app]) {
                updatedFeatures = updatedFeatures.concat((allFeatures as any)[app]);
            }
        })
        setFeatures(updatedFeatures);
    }, [apps]);

    const [verticals, setVerticals] = useState({
        "Education": false,
        "Enterprise": false,
        "Virtual Event": false,
        "Media": false,
        "VPaas": false
    });
    const onVerticalsChange = (event: any) => {
        let newVericals: any = {...verticals};
        newVericals[event.target.value] = event.target.checked;
        setVerticals(newVericals);
    }

    const [features, setFeatures] = useState<{label: string, value: string}[]>([]);
    const [feature, setFeature] = useState('');
    const onFeatureChange = (feature: string | number) => {
        setFeature(feature as string);
    }

    const apply = () => {
        const selectedApps: string[] = [];
        Object.keys(apps).forEach(app =>{
            if ((apps as any)[app] === true) {
                selectedApps.push(app);
            }
        })
        setSelectedApps(selectedApps.join(', '));

        const selectedVerticals: string[] = [];
        Object.keys(verticals).forEach(vertical =>{
            if ((verticals as any)[vertical] === true) {
                selectedVerticals.push(vertical);
            }
        })
        setSelectedVerticals(selectedVerticals.join(', '));
        onFilterChange({
            apps: selectedApps.join(analyticsConfig.valueSeparator),
            verticals: selectedVerticals.join(analyticsConfig.valueSeparator),
            feature
        })
        setOpen(false);
    }

    const getFeatureLabel = (feature: string) => {
        return features.find(feat => feat.value === feature)?.label || feature;
    }
    return (
        <div className={open ? 'filter open' : 'filter'}>
            <div className="container">
                <div className="filterTitle" onClick={() => setOpen(!open)}>
                    {(open || (!open && selectedApps.length === 0)) && <span>Filter</span>}
                    {!open && selectedApps.length > 0 && <span>{selectedApps}</span>}
                    {!open && selectedApps.length > 0 && selectedVerticals.length > 0 && <span style={{marginLeft: '16px'}}><span style={{marginRight: '16px'}}>|</span>{selectedVerticals}</span>}
                    {!open && selectedApps.length > 0 && feature.length > 0 && <span style={{marginLeft: '16px'}}><span style={{marginRight: '16px'}}>|</span>{getFeatureLabel(feature)}</span>}
                    {open && <ChevronDown24Icon className="arrow"/>}
                    {!open && <ChevronUp24Icon className="arrow"/>}
                </div>
                <div className="filtersContainer">
                    <div className="filterContent">
                        <span className="title">Application</span>
                        <div className="multiColumns">
                            <Stack spacing={1}>
                                <Checkbox label="KMS" value="KMS" checked={apps["KMS"]} onChange={onAppChange}/>
                                <Checkbox label="KME" value="KME" checked={apps["KME"]} onChange={onAppChange}/>
                                <Checkbox label="EP" value="EP" checked={apps["EP"]} onChange={onAppChange}/>
                                <Checkbox label="KMC" value="KMC" checked={apps["KMC"]} onChange={onAppChange}/>
                                <Checkbox label="Analytics" value="Analytics" checked={apps["Analytics"]}
                                          onChange={onAppChange}/>
                            </Stack>
                            <Stack spacing={1} style={{'marginLeft': '32px'}}>
                                <Checkbox label="KAF" value="KAF" checked={apps["KAF"]} onChange={onAppChange}/>
                                <Checkbox label="Webcasting" value="Webcasting" checked={apps["Webcasting"]}
                                          onChange={onAppChange}/>
                                <Checkbox label="KPF" value="KPF" checked={apps["KPF"]} onChange={onAppChange}/>
                                <Checkbox label="Studio" value="Studio" checked={apps["Studio"]} onChange={onAppChange}/>
                                <Checkbox label="Player" value="Player" checked={apps["Player"]} onChange={onAppChange}/>
                            </Stack>
                        </div>
                    </div>

                    <div className="filterContent">
                        <span className="title">Vertical</span>
                        <Stack spacing={1}>
                            <Checkbox label="Education" value="Education" checked={verticals["Education"]}
                                      onChange={onVerticalsChange}/>
                            <Checkbox label="Enterprise" value="Enterprise" checked={verticals["Enterprise"]}
                                      onChange={onVerticalsChange}/>
                            <Checkbox label="Virtual Event" value="Virtual Event" checked={verticals["Virtual Event"]}
                                      onChange={onVerticalsChange}/>
                            <Checkbox label="Media" value="Media" checked={verticals["Media"]}
                                      onChange={onVerticalsChange}/>
                            <Checkbox label="VPaas" value="VPaas" checked={verticals["VPaas"]}
                                      onChange={onVerticalsChange}/>
                        </Stack>
                    </div>

                    <div className="filterContent">
                        <span className="title">Feature</span>
                        <Dropdown width="200px" label="Select Feature" value={feature} onChange={onFeatureChange}>
                            {features.map(item => <MenuItem key={item.value} value={item.value} label={item.label}/>)}
                        </Dropdown>
                    </div>
                </div>

            </div>
            <div onClick={apply} className="btn"><span>Apply</span></div>
        </div>
    )
}

export default Filter;

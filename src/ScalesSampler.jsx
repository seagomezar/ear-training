import React, { useState, useRef, useEffect } from "react";
import { Sampler, Transport } from "tone";
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay'
import { SCALES, SALAMANDER_PIANO_SOUNDS, FIFTHS, NEGATIVE_FIFTHS, OBTENER_ACORDE} from './constants';
import { BUILD_XML } from "./musicxml.template";

export const ScalesSampler = () => {
    const [isLoaded, setLoaded] = useState(false);
    const [note, setNote] = useState('C');
    const [mode, setMode] = useState('major');
    const [octave, setOctave] = useState(4);
    const [xml, setXML] = useState();
    const sampler = useRef(null);

    useEffect(() => {

        sampler.current = new Sampler(
            SALAMANDER_PIANO_SOUNDS,
            {
                'release': 1,
                'baseUrl': './salamander/',
                onload: () => {
                    setLoaded(true);
                }
            }
        ).toDestination();

    }, []);


    const handlePlayScale = () => {
        playScale(`${note} ${mode}`, octave);
    };

    const handlePlayWithArpegio = () => {
        playScaleWithArpeggio(`${note} ${mode}`, octave);
    };

    const handlePlayArpegio = () => {
        playArpeggio(`${note} ${mode}`, octave);
    };

    const handlePlayChords = () => {
        playChords(`${note} ${mode}`, octave);
    };

    const playScale = async (scaleType, startOctave = 4) => {
        if (!SCALES[scaleType]) {
            console.error('Escala no reconocida');
            return;
        }

        let currentOctave = startOctave;
        let hasOctaveIncreased = false;

        const notesWithOctave = SCALES[scaleType].map((note, index) => {
            if (!hasOctaveIncreased && index && (note === 'C' || note === 'C#')) {
                currentOctave++;
                hasOctaveIncreased = false;
            }
            return note + currentOctave;
        });

        console.warn(notesWithOctave);

        const fullScale = [...notesWithOctave, ...notesWithOctave.slice().reverse().slice(1)];


        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let note of fullScale) {
            console.info(note)
            sampler.current.triggerAttackRelease(note, '8n');
            await new Promise(resolve => setTimeout(resolve, 500));  // 500 ms delay between notes
        }
    }

    const playArpeggio = async (scaleType, startOctave = 4) => {
        if (!SCALES[scaleType]) {
            console.error('Escala no reconocida');
            return;
        }

        const arpeggioNotes = [
            SCALES[scaleType][0],  // 1er grado
            SCALES[scaleType][2],  // 3er grado
            SCALES[scaleType][4],  // 5to grado
            SCALES[scaleType][7]   // 8vo grado (octava)
        ];

        let currentOctave = startOctave;
        let hasOctaveIncreased = false;

        const arpeggioWithOctave = arpeggioNotes.map((note, index) => {
            if (!hasOctaveIncreased && index && (note === 'C' || note === 'C#')) {
                currentOctave++;
                hasOctaveIncreased = true;
            }
            return note + currentOctave;
        });

        const fullArpeggioWithOctave = [...arpeggioWithOctave, ...arpeggioWithOctave.slice().reverse().slice(1)];

        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let note of fullArpeggioWithOctave) {

            sampler.current.triggerAttackRelease(note, '8n');
            await new Promise(resolve => setTimeout(resolve, 500));  // 500 ms delay between notes
        }
    };

    const playScaleWithArpeggio = async (scaleType, startOctave = 4) => {
        await playScale(scaleType, startOctave);
        await playArpeggio(scaleType, startOctave);
    };

    const playChords = async (scaleType, startOctave = 4) => {
        if (!SCALES[scaleType]) {
            console.error('Escala no reconocida');
            return;
        }
        const firstChord = OBTENER_ACORDE(SCALES[scaleType], 1, startOctave, false, 0)
        const fourthChord = OBTENER_ACORDE(SCALES[scaleType], 4, startOctave, false, 0)
        const firstChord2ndInversion = OBTENER_ACORDE(SCALES[scaleType], 1, startOctave, false, 2);
        const fifthChord = OBTENER_ACORDE(SCALES[scaleType], 5, startOctave, true, 0);

        const chordsWithOctave = [firstChord, fourthChord, firstChord2ndInversion, fifthChord, firstChord];
    
        let xmlString = ``;
    
            for (let j = 0; j < chordsWithOctave.length; j++) {
                if(j>0) {
                    xmlString += `<measure>`;
                }
                let chord = chordsWithOctave[j];
                for (let i = 0; i < chord.length; i++) {  // Usamos un loop con índice para saber si estamos en la primera nota
                    const note = chord[i];
                    const noteName = note.slice(0, -1);
                    const noteAccidental = note.includes("#") ? "sharp" : note.includes("b") ? "flat" : ""; 
                    const octave = note.slice(-1);
                    xmlString += `<note>`;
                    if (i !== 0) {  // Si no es la primera nota, añadimos la etiqueta <chord/>
                        xmlString += `<chord/>`;
                    }
                    xmlString += `
                        <pitch>
                        <step>${noteName.replace("#", "").replace("b", "")}</step>
                        ${noteAccidental ? `<alter>${noteAccidental === "sharp" ? 1 : -1}</alter>` : ""}
                        <octave>${octave}</octave>
                        </pitch>
                        <duration>4</duration>
                        <type>whole</type>
                    </note>`;
                }
                xmlString += `</measure>`;
                sampler.current.triggerAttackRelease(chord, '1h');
                await new Promise(resolve => setTimeout(resolve, 1000));
        }
        let fifths = 0;
        if(scaleType.indexOf("b") === -1 && scaleType.indexOf("#") === -1){
            fifths = FIFTHS.indexOf(scaleType.slice(0, 1));
            if(!fifths)
                fifths = NEGATIVE_FIFTHS.indexOf(scaleType.slice(0, 1))*-1;
        } else if(scaleType.indexOf("b") > -1){
            fifths = NEGATIVE_FIFTHS.indexOf(scaleType.slice(0, 2))*-1;
        } else if(scaleType.indexOf("#") > -1){
            fifths = FIFTHS.indexOf(scaleType.slice(0, 2));
            console.log(fifths)
        }
        
        const xml = BUILD_XML({title : scaleType + " Scale Harmonization", fifths,body: xmlString});
        setXML(xml);
    };
    
    

    return (<div>
        {(isLoaded) && <div>
            <label>
                Nota:
                <select value={note} onChange={e => setNote(e.target.value)}>
                    {['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map(n =>
                        <option key={n} value={n}>{n}</option>
                    )}
                </select>
            </label>
            <label>
                Modo:
                <select value={mode} onChange={e => setMode(e.target.value)}>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                </select>
            </label>
            <label>
                Octava:
                <select value={octave} onChange={e => setOctave(parseInt(e.target.value, 10))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(o =>
                        <option key={o} value={o}>{o}</option>
                    )}
                </select>
            </label>
            <button onClick={handlePlayScale}>Play Scale</button>
            <button onClick={handlePlayWithArpegio}>Play Scale with Arpegio</button>
            <button onClick={handlePlayArpegio}>Play Arpegio</button>
            <button onClick={handlePlayChords}>Play Chords</button>
            {xml && <OpenSheetMusicDisplay file={xml} />}
        </div>}
        </div>);
};
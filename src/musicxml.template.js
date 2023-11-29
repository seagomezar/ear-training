export const BUILD_XML = ({title, fifths, body})=>{
    return `
<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="2.0">
<work>
    <work-number>Op. 98</work-number>
    <work-title>${title}</work-title>
</work>
<identification>
    <creator type="composer">Sebastian Gomez</creator>
    <creator type="lyricist">Aloys Jeitteles</creator>
    <rights>Copyright © 2002 Recordare LLC</rights>
    <encoding>
        <software>Finale 2011 for Windows</software>
        <software>Dolet Light for Finale 2011</software>
        <encoding-date>2010-12-10</encoding-date>
        <supports attribute="new-system" element="print" type="yes" value="yes"/>
        <supports attribute="new-page" element="print" type="yes" value="yes"/>
    </encoding>
</identification>
<defaults>
    <scaling>
        <millimeters>6.35</millimeters>
        <tenths>40</tenths>
    </scaling>
    <page-layout>
        <page-height>1760</page-height>
        <page-width>1360</page-width>
        <page-margins type="both">
            <left-margin>80</left-margin>
            <right-margin>80</right-margin>
            <top-margin>80</top-margin>
            <bottom-margin>80</bottom-margin>
        </page-margins>
    </page-layout>
    <system-layout>
        <system-margins>
            <left-margin>71</left-margin>
            <right-margin>0</right-margin>
        </system-margins>
        <system-distance>108</system-distance>
        <top-system-distance>65</top-system-distance>
    </system-layout>
    <staff-layout>
        <staff-distance>101</staff-distance>
    </staff-layout>
    <appearance>
        <line-width type="stem">0.957</line-width>
        <line-width type="beam">5.0391</line-width>
        <line-width type="staff">0.957</line-width>
        <line-width type="light barline">1.875</line-width>
        <line-width type="heavy barline">5.0391</line-width>
        <line-width type="leger">1.875</line-width>
        <line-width type="ending">0.957</line-width>
        <line-width type="wedge">0.957</line-width>
        <line-width type="enclosure">0.957</line-width>
        <line-width type="tuplet bracket">0.957</line-width>
        <note-size type="grace">60</note-size>
        <note-size type="cue">60</note-size>
    </appearance>
    <music-font font-family="Maestro" font-size="18"/>
    <word-font font-family="Times New Roman" font-size="9"/>
    <lyric-font font-family="Times New Roman" font-size="10"/>
</defaults>
<credit page="1">
    <credit-words default-x="680" default-y="1678" font-size="24" justify="center" valign="top">An die ferne Geliebte</credit-words>
    <credit-words font-size="24" font-weight="bold"></credit-words>
    <credit-words font-size="14" font-weight="normal">Op. 98</credit-words>
</credit>
    <credit page="1">
    <credit-words default-x="680" default-y="65" font-size="9" justify="center" valign="bottom">Copyright © 2002 Recordare LLC</credit-words>
</credit>
<credit page="1">
    <credit-words default-x="80" default-y="1545" font-size="12" valign="top">Aloys Jeitteles</credit-words>
</credit>
<credit page="1">
    <credit-words default-x="1280" default-y="1545" font-size="12" halign="right" justify="center" valign="top">Ludwig van Beethoven</credit-words>
</credit>
<part-list>
    <score-part id="P1">
        <part-name>Voice</part-name>
    </score-part>
</part-list>
<part id="P1">
    <measure>
    <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>${fifths}</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
    ${body}
</part>
</score-partwise>`;
}
// Created by iWeb 2.0.2 local-build-20071114

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({shadow_1:new IWShadow({blurRadius:10,offset:new IWPoint(4.2426,4.2426),color:'#000000',opacity:0.750000}),shadow_0:new IWShadow({blurRadius:10,offset:new IWPoint(4.2426,4.2426),color:'#000000',opacity:0.750000}),stroke_0:new IWEmptyStroke(),stroke_1:new IWStrokeParts([{rect:new IWRect(-1,1,2,41),url:'IPFifo_files/stroke.png'},{rect:new IWRect(-1,-1,2,2),url:'IPFifo_files/stroke_1.png'},{rect:new IWRect(1,-1,166,2),url:'IPFifo_files/stroke_2.png'},{rect:new IWRect(167,-1,2,2),url:'IPFifo_files/stroke_3.png'},{rect:new IWRect(167,1,2,41),url:'IPFifo_files/stroke_4.png'},{rect:new IWRect(167,42,2,2),url:'IPFifo_files/stroke_5.png'},{rect:new IWRect(1,42,166,2),url:'IPFifo_files/stroke_6.png'},{rect:new IWRect(-1,42,2,2),url:'IPFifo_files/stroke_7.png'}],new IWSize(168,43))});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('IPFifo_files/IPFifoMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');adjustLineHeightIfTooBig('id4');adjustFontSizeIfTooBig('id4');Widget.onload();fixAllIEPNGs('Media/transparent.gif');applyEffects()}
function onPageUnload()
{Widget.onunload();}

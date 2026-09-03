precision highp float;
varying vec2 v_texcoord;
uniform sampler2D _MainTex;
void main(){
    gl_FragColor = texture2D(_MainTex, v_texcoord);
}

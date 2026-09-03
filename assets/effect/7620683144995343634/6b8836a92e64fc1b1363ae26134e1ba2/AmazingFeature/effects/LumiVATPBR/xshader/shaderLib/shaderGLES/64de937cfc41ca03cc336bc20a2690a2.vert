
uniform vec3 u_minValues;
uniform vec3 u_maxValues;
uniform float u_displayFrame;
uniform float u_frameCount;
uniform float u_yResolution;
uniform mediump sampler2D u_vatPosTex;
uniform mediump sampler2D u_vatNormTex;
uniform int u_absoluteNormal;
uniform mat4 u_MVP;
uniform mat4 u_Model;
uniform mat4 u_TransposeInvModel;

attribute vec2 a_uv1;
attribute vec3 a_position;
varying vec3 v_posWS;
varying vec3 v_nDirWS;
varying vec3 v_tDirWS;
varying vec3 v_bDirWS;
varying vec2 v_uv0;
attribute vec2 a_uv0;
varying vec2 v_uv1;

vec3 _f0(vec3 _p0, bool _p1)
{
    vec2 _20;
    if (_p1)
    {
        _20 = vec2(1.0, -1.0);
    }
    else
    {
        _20 = vec2(u_minValues.x, u_maxValues.x);
    }
    vec2 _t0 = _20;
    vec2 _t1 = vec2(u_minValues.y, u_maxValues.y);
    vec2 _t2 = vec2(u_minValues.z, u_maxValues.z);
    return vec3(mix(_t0.x, _t0.y, _p0.x), mix(_t1.x, _t1.y, _p0.y), mix(_t2.x, _t2.y, _p0.z));
}

void main()
{
    vec2 _110 = vec2(a_uv1.x, (1.0 - a_uv1.y) + ((fract(u_displayFrame / u_frameCount) * (u_frameCount - 1.0)) / u_yResolution));
    vec3 param = texture2DLod(u_vatPosTex, _110, 0.0).xyz;
    bool param_1 = false;
    vec3 _t11 = (texture2DLod(u_vatNormTex, _110, 0.0).xyz * 2.0) - vec3(1.0);
    if (u_absoluteNormal == 1)
    {
        _t11 = abs(_t11);
    }
    vec4 _166 = vec4(a_position + _f0(param, param_1), 1.0);
    gl_Position = u_MVP * _166;
    v_posWS = (u_Model * _166).xyz;
    v_nDirWS = (u_TransposeInvModel * vec4(_t11, 0.0)).xyz;
    vec3 _191 = normalize(v_nDirWS);
    bvec3 _206 = bvec3(abs(dot(_191, vec3(0.0, 1.0, 0.0))) < 0.89999997615814208984375);
    vec3 _212 = normalize(cross(vec3(_206.x ? vec3(0.0, 1.0, 0.0).x : vec3(1.0, 0.0, 0.0).x, _206.y ? vec3(0.0, 1.0, 0.0).y : vec3(1.0, 0.0, 0.0).y, _206.z ? vec3(0.0, 1.0, 0.0).z : vec3(1.0, 0.0, 0.0).z), _191));
    v_tDirWS = normalize(_212 - (_191 * dot(_212, _191)));
    v_bDirWS = normalize(cross(_191, v_tDirWS));
    v_uv0 = a_uv0;
}


THREE.DodecahedronGeometry = function ( radius, detail ) {

    this.parameters = {
        radius: radius,
        detail: detail
    };

    var t = ( 1 + Math.sqrt( 5 ) ) / 2;
    var u = 1 / t;

    // (±1, ±1, ±1)
    // (0, ±1/φ, ±φ)
    // (±φ, 0, ±1/φ)
    // (±1/φ, ±φ, 0)
    // where φ = (1 + √5) / 2 is the golden ratio (also written τ) ≈ 1.618.
    var vertices = [
         1,  1,  1,    1,  1, -1,    1, -1,  1,    1, -1, -1,
        -1,  1,  1,   -1,  1, -1,   -1, -1,  1,   -1, -1, -1,
         0,  u,  t,    0,  u, -t,    0, -u,  t,    0, -u, -t,
         t,  0,  u,    t,  0, -u,   -t,  0,  u,   -t,  0, -u,
         u,  t,  0,    u, -t,  0,   -u,  t,  0,   -u, -t,  0
    ];

    // pentagonal face vertex indices
    var faces = [
        [ 18,  4,  8,  0, 16 ],
        [ 16,  1,  9,  5, 18 ],
        [ 17,  2, 10,  6, 19 ],
        [ 19,  7, 11,  3, 17 ],
        [ 10,  2, 12,  0,  8 ],
        [  9,  1, 13,  3, 11 ],
        [  8,  4, 14,  6, 10 ],
        [ 11,  7, 15,  5,  9 ],
        [ 13,  1, 16,  0, 12 ],
        [ 12,  2, 17,  3, 13 ],
        [ 14,  4, 18,  5, 15 ],
        [ 15,  7, 19,  6, 14 ]
    ];

    var indices = [];

    for (var i = 0; i < faces.length; i++) {

        // pentagon -> 3 triangles:
        //       a
        //    e  -  b
        //     d / c

        // first triangle: a,b,e
        indices.push(faces[i][0]);
        indices.push(faces[i][1]);
        indices.push(faces[i][4]);

        // second triangle: b,d,e
        indices.push(faces[i][1]);
        indices.push(faces[i][2]);
        indices.push(faces[i][3]);

        // third triangle: b,c,d
        indices.push(faces[i][1]);
        indices.push(faces[i][3]);
        indices.push(faces[i][4]);

    }

    THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

};

THREE.DodecahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
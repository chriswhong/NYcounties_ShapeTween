NYcounties_ShapeTween
=====================

D3 Shape Tweening from GeoJSON to Circles

Based on this awesome tweening block by Mbostock: http://bl.ocks.org/mbostock/3081153

This is a first pass at turning counties into other shapes.  The notion was to animate a map into a chart, but I'm not sure if that even makes sense to do.  Either way, shape tweening rules.

Shape Tweening works best with polygons that have lots of vertices, as the start and end polygons need to have the same number of vertices.  The circle-building function in the example depends on this. Unforunately, the counties of New York State have LOTS of straight lines in them, meaning there are large spans between some vertices, resulting in some not-quite circles.  I'm basically injecting lots of vertices into the circles that don't exist in the original geoJSON.  

See it in action at:  http://www.chriswhong.com/sandbox/nytween/

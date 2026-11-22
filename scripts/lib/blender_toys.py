"""Shared modelling primitives and orthographic camera for pre-rendered game art."""
import math

import bpy
from mathutils import Vector


def mat(color):
    found = bpy.data.materials.get(color)
    if found:
        return found
    m = bpy.data.materials.new(color)
    m.use_nodes = True
    shader = m.node_tree.nodes.get("Principled BSDF")
    rgb = [int(color[i:i+2], 16)/255 for i in (0, 2, 4)]
    shader.inputs["Base Color"].default_value = [((v+.055)/1.055)**2.4 if v>.04045 else v/12.92 for v in rgb]+[1]
    m.diffuse_color = shader.inputs["Base Color"].default_value
    shader.inputs["Roughness"].default_value = .36
    return m


def finish(obj, color, bevel=0):
    obj.data.materials.append(mat(color))
    if bevel:
        mod = obj.modifiers.new("Rounded joinery", "BEVEL")
        mod.width, mod.segments = bevel, 2
        obj.modifiers.new("Face normals", "WEIGHTED_NORMAL")
    return obj


def block(pos, size, color, bevel=.04):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    obj = bpy.context.object
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, color, bevel)


def cone(pos, base, tip, height, color, sides=20):
    bpy.ops.mesh.primitive_cone_add(vertices=sides, radius1=base, radius2=tip, depth=height, location=pos)
    return finish(bpy.context.object, color, min(.028, base/12, height/10))


def beam(a, b, radius, color, sides=14):
    a, b = Vector(a), Vector(b)
    obj = cone((a+b)/2, radius, radius, (b-a).length, color, sides)
    obj.rotation_euler = (b-a).to_track_quat('Z','Y').to_euler()
    return obj


def rock(pos, size, color, detail=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=detail, radius=1, location=pos)
    obj = finish(bpy.context.object, color)
    obj.scale = size
    return obj


def solid(name, rows, color, bevel=0):
    # A series of rectangular cross-sections, wound along the direction of travel.
    points = [p for row in rows for p in row]
    sides = len(rows[0])
    faces = [tuple(reversed(range(sides))), tuple(range(len(points)-sides,len(points)))]
    for j in range(len(rows)-1):
        for k in range(sides):
            a, b = j*sides+k, j*sides+(k+1)%sides
            faces.append((a,b,b+sides,a+sides))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(points, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return finish(obj,color,bevel)


def clear():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


def render(path, size, target, ortho, azimuth=0, sky=None, project=None, elevation=math.radians(34)):
    scene=bpy.context.scene
    direction=Vector((math.sin(azimuth)*math.cos(elevation),-math.cos(azimuth)*math.cos(elevation),math.sin(elevation)))
    camera_data=bpy.data.cameras.new("Orthographic")
    camera=bpy.data.objects.new("Camera",camera_data)
    scene.collection.objects.link(camera)
    camera.location=Vector(target)+direction*28
    camera.rotation_euler=(-direction).to_track_quat('-Z','Y').to_euler()
    camera_data.type='ORTHO'
    camera_data.ortho_scale=ortho
    scene.camera=camera
    bpy.ops.object.light_add(type='SUN', location=(-7,-9,13))
    sun=bpy.context.object
    sun.rotation_euler=(-sun.location).to_track_quat('-Z','Y').to_euler()
    sun.data.energy, sun.data.angle=3.1,.18
    scene.world.use_nodes=True
    background=scene.world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value=(.78,.88,1,1)
    background.inputs["Strength"].default_value=.50
    if sky:
        # A camera-only sky keeps its warm/cool hue out of the model lighting.
        tree=scene.world.node_tree
        sky_node=tree.nodes.new("ShaderNodeBackground")
        sky_node.inputs[0].default_value=mat(sky).node_tree.nodes.get("Principled BSDF").inputs[0].default_value
        mix=tree.nodes.new("ShaderNodeMixShader")
        tree.links.new(tree.nodes.new("ShaderNodeLightPath").outputs["Is Camera Ray"],mix.inputs[0])
        tree.links.new(background.outputs[0],mix.inputs[1])
        tree.links.new(sky_node.outputs[0],mix.inputs[2])
        tree.links.new(mix.outputs[0],tree.nodes.get("World Output").inputs[0])
    scene.render.engine='CYCLES'
    scene.cycles.samples=12
    scene.cycles.use_denoising=True
    scene.view_settings.view_transform='AgX'
    scene.view_settings.look='AgX - Medium High Contrast'
    scene.render.film_transparent=not sky
    scene.render.resolution_x,scene.render.resolution_y=size
    scene.render.resolution_percentage=100
    scene.render.filepath=str(path)
    if project:
        for area in bpy.context.screen.areas:
            if area.type=='VIEW_3D':
                space=area.spaces.active
                space.region_3d.view_perspective='CAMERA'
                space.overlay.show_overlays=False
                space.shading.color_type='MATERIAL'
        bpy.ops.object.select_all(action='DESELECT')
        bpy.ops.wm.save_as_mainfile(filepath=str(project),compress=True)
    else:
        bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(camera,do_unlink=True)
    bpy.data.objects.remove(sun,do_unlink=True)

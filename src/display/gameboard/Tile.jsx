/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.12 Tile.glb --transform 
Files: Tile.glb [9.28KB] > Tile-transformed.glb [3.29KB] (65%)
*/

import { useState } from 'react';

import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import { useLoader } from '@react-three/fiber'

import * as THREE from 'three'

import React, { useRef, useMemo, createContext, useContext } from 'react'
import { useGLTF, useTexture, Merged } from '@react-three/drei'

const context = createContext()

export function Instances({children}) {
	const { nodes } = useGLTF('/3D_Assets/Tile-transformed.glb')

	const instances = useMemo(
	  () => ({
		TileFront: nodes.Tile_Front,
		TileFrontRim: nodes.Tile_Front_Rim,
		TileBody: nodes.Tile_Body,
		TileBack: nodes.Tile_Back,
		TileBackRim: nodes.Tile_Back_Rim,
	  }),
	  [nodes]
	)

    return (
		<group dispose={null}>
			<Merged meshes={instances}>
				{(instances) => <context.Provider value={instances} children={children} />}
			</Merged>
		</group>
    )
}

export function Tile(
	{
		tileId, 
		position, 
		symbol, 
		symbolColor, 
		peeking, 
		currentTiles, 
		handleTileClick
	}
) {

	const [hovered, setHovered] = useState(false)

	const instances = useContext(context)

	const tileLogoTexture = useTexture('/3D_Assets/Tile_Logo.png')

	// Many thanks to mrdoob for this example of SVGLoader on GitHub! https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_svg.html
	function loadSymbol() {

		const finalSvg = [];
		// add materials and geometry into array without putting it into a THREE.Group

		const texture = useLoader(SVGLoader, symbol)

		let renderOrder = 0;

		for ( const path of texture.paths ) {

			const fillColor = path.userData.style.fill;

			if ( fillColor !== undefined && fillColor !== 'none' ) {

				const material = new THREE.MeshBasicMaterial( {
					color: new THREE.Color().setStyle( symbolColor ),
					opacity: path.userData.style.fillOpacity,
					transparent: true,
					side: THREE.DoubleSide,
					depthWrite: false,
				} );

				const shapes = SVGLoader.createShapes( path );

				for ( const shape of shapes ) {

					const geometry = new THREE.ShapeGeometry( shape );
					geometry.applyMatrix4(new THREE.Matrix4().makeScale ( 1, -1, 1 ))
					// Without applyMatrix4, the svg would be displayed upside down

					finalSvg.push({
						material: material,
						geometry: geometry
					})
					const mesh = new THREE.Mesh( geometry, material );
					mesh.renderOrder = renderOrder ++;

				}

			}

			const strokeColor = path.userData.style.stroke;

			if ( strokeColor !== undefined && strokeColor !== 'none' ) {

				const material = new THREE.MeshBasicMaterial( {
					color: new THREE.Color().setStyle( strokeColor ),
					opacity: path.userData.style.strokeOpacity,
					transparent: true,
					side: THREE.DoubleSide,
					depthWrite: false,
				} );

				for ( const subPath of path.subPaths ) {

					const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );
					geometry.applyMatrix4(new THREE.Matrix4().makeScale ( 1, -1, 1 ))
					// Without applyMatrix4, the svg would be displayed upside down

					finalSvg.push({
						material: material,
						geometry: geometry
					})

					if ( geometry ) {

						const mesh = new THREE.Mesh( geometry, material );
						mesh.renderOrder = renderOrder ++;

					}

				}

			}

		}

		return finalSvg;
		
	}

	let symbolTexture = loadSymbol();

	let symbolScale = 0.025;

	let symbolPosition = {...position};
	symbolPosition.x = -1.25;
	symbolPosition.y = 1.3;
	symbolPosition.z = .47;

	let matchingTilesFrontRimColor = '';

	if (
		currentTiles?.some(tile => tile.tileId === tileId) &&
		currentTiles[0]?.symbol === currentTiles[1]?.symbol &&
		currentTiles[0]?.symbolColor === currentTiles[1]?.symbolColor
	) {
		matchingTilesFrontRimColor = '#413E3B';
	} else if (currentTiles.length <= 1) {
		matchingTilesFrontRimColor = '#FFFED0';
	} else if (
		currentTiles?.some(tile => tile.tileId === tileId) &&
		(
			currentTiles[0]?.symbol !== currentTiles[1]?.symbol ||
			currentTiles[0]?.symbolColor !== currentTiles[1]?.symbolColor
		)
	) {
		matchingTilesFrontRimColor = '#EA4525';
	}

	let symbolDisplay = (
		(
			peeking === true 
			|| 
			currentTiles?.some(tile => tile.tileId === tileId) === true
		)
		?
		<group>
			{
				symbolTexture?.map(({material, geometry}, index) => {
					return (
						<mesh 
							key={material.uuid + index} 
							renderOrder={index} 
							position={
								[
									symbolPosition.x, 
									symbolPosition.y, 
									symbolPosition.z
								]
							} 
							scale={symbolScale} 
							geometry={geometry} 
							material={material}
						>
						</mesh>
					)
				})
			}
		</group>
		:
		<></>
	)

	return (
		<group 
			dispose={null} 
			position={position}
			rotation={
				(peeking || currentTiles?.some(tile => tile.tileId === tileId)) 
				? 
				[0, 0, 0] 
				: 
				[0, Math.PI, 0]
			}
			onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
			onPointerOut={(e) => (e.stopPropagation(), setHovered(false))}
			onClick={
				() => peeking 
				? 
				'' 
				: 
				handleTileClick(tileId, symbol, symbolColor)
			}
		>
			<mesh scale={[-.5, .5, .5]} position={[0, 0, -.5]}>
				<planeGeometry args={[2, 2.8]}></planeGeometry>
				<meshBasicMaterial 
					map={tileLogoTexture} 
					transparent 
					side={THREE.DoubleSide}
				>
				</meshBasicMaterial>
			</mesh>

			{symbolDisplay}

			<group>			
				<instances.TileFront />
				<instances.TileFrontRim color={matchingTilesFrontRimColor} />
				<instances.TileBody />
				<instances.TileBack />
				<instances.TileBackRim 
					color={
						(hovered === true && peeking === false) 
						? 
						'#5248C1' 
						: 
						'#FFFED0'
					} 
				/>
			</group>
		</group>
	)
}

useGLTF.preload('/3D_Assets/Tile-transformed.glb')
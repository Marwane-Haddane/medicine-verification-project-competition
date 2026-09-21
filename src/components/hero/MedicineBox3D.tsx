'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MedicineBox3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 420;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // Renderer setup with graceful fallback
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('Three.js WebGL renderer initialization failed or not supported:', e);
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0d9488, 1.2);
    dirLight2.position.set(-5, -4, -3);
    scene.add(dirLight2);

    // Laser point light attached directly to boxMesh so it rotates with the box face
    const laserLight = new THREE.PointLight(0x14b8a6, 2.5, 5);

    // Helper to generate dynamic procedural canvas textures for the box
    const createFrontTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1400;
      const ctx = canvas.getContext('2d')!;

      // Background: pristine clinical white with subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1400);
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(0.5, '#F8FAFC');
      bgGrad.addColorStop(1, '#F1F5F9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1400);

      // Border outline
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 8;
      ctx.strokeRect(16, 16, 992, 1368);

      // Top decorative teal security stripe
      ctx.fillStyle = '#0D9488';
      ctx.fillRect(20, 20, 984, 90);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('AMMPS RX AUTHENTICATED • DMP MAROC', 50, 75);

      // Security Hologram badge mockup
      ctx.save();
      const holoGrad = ctx.createLinearGradient(820, 40, 940, 140);
      holoGrad.addColorStop(0, '#2DD4BF');
      holoGrad.addColorStop(0.3, '#E0F2FE');
      holoGrad.addColorStop(0.7, '#A7F3D0');
      holoGrad.addColorStop(1, '#38BDF8');
      ctx.fillStyle = holoGrad;
      ctx.beginPath();
      ctx.roundRect(830, 35, 120, 60, 12);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('SECURE', 845, 74);
      ctx.restore();

      // Drug Brand Title
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 110px sans-serif';
      ctx.fillText('AZOLE', 60, 260);

      ctx.fillStyle = '#0D9488';
      ctx.font = 'bold 64px monospace';
      ctx.fillText('400 mg', 460, 260);

      // Subtitle
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 500 38px sans-serif';
      ctx.fillText('Albendazole • Antihelminthique', 60, 320);

      // Dosage pill row
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(60, 360, 904, 3);

      ctx.fillStyle = '#334155';
      ctx.font = '600 34px sans-serif';
      ctx.fillText('1 Comprimé à croquer', 60, 420);
      ctx.font = '500 32px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Voie orale • Usage sur ordonnance', 60, 465);

      // Laboratory Stamp
      ctx.fillStyle = '#0F766E';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('LABORATOIRES LAPROPHAN / PROMOPHARM', 60, 540);

      // Center container for GS1 DataMatrix
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0D9488';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(60, 600, 904, 460, 24);
      ctx.fill();
      ctx.stroke();

      // Draw simulated 2D DataMatrix inside canvas
      const matrixSize = 340;
      const startX = 100;
      const startY = 660;
      ctx.fillStyle = '#0F172A';

      // 14x14 grid pattern for high realism
      const cells = 14;
      const cellSize = matrixSize / cells;
      const seed = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,1,0,1,1,0,0,1,1,0,1,1,0,1,
        1,0,1,1,0,1,0,1,0,1,1,0,1,0,
        1,1,1,0,0,1,1,0,1,0,0,1,1,1,
        1,0,0,1,1,0,1,1,0,1,1,0,0,0,
        1,1,0,1,0,1,0,0,1,0,1,1,0,1,
        1,0,1,0,1,1,1,0,0,1,0,1,0,0,
        1,1,0,0,1,0,1,1,0,1,1,0,1,1,
        1,0,1,1,0,1,0,0,1,0,0,1,0,0,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,
        1,0,0,1,0,0,1,0,1,1,0,0,1,0,
        1,1,1,1,0,1,1,0,0,1,1,1,0,1,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0
      ];

      for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
          if (seed[r * cells + c]) {
            ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }

      // GS1 Badge under barcode
      ctx.fillStyle = '#0D9488';
      ctx.beginPath();
      ctx.roundRect(startX, startY + matrixSize + 12, 100, 36, 8);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('GS1 2D', startX + 12, startY + matrixSize + 37);

      // Human Readable Interpretation (HRI)
      const hriX = 490;
      ctx.fillStyle = '#475569';
      ctx.font = '600 30px monospace';
      ctx.fillText('(01) GTIN:', hriX, 700);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('06111234567890', hriX, 740);

      ctx.fillStyle = '#475569';
      ctx.font = '600 30px monospace';
      ctx.fillText('(17) EXPIRATION:', hriX, 800);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('11/2027', hriX, 840);

      ctx.fillStyle = '#475569';
      ctx.font = '600 30px monospace';
      ctx.fillText('(10) LOT / BATCH:', hriX, 900);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('B2024-X88', hriX, 940);

      ctx.fillStyle = '#475569';
      ctx.font = '600 30px monospace';
      ctx.fillText('(21) SERIAL N°:', hriX, 1000);
      ctx.fillStyle = '#0D9488';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('SN9872134567', hriX, 1040);

      // Footer
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(60, 1100, 904, 3);

      ctx.fillStyle = '#0D9488';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('✔ AMMPS LIVE NODE VERIFIED', 60, 1160);

      ctx.fillStyle = '#64748B';
      ctx.font = '26px monospace';
      ctx.fillText('AMM N° 920 342 1 • P.P.V. 14.50 DH', 60, 1205);

      // Security seal footer
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(20, 1300, 984, 80);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('DIGITAL SERIALIZATION TRACEABILITY SYSTEM', 120, 1350);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      return texture;
    };

    const createSideTexture = (text: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 1400;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 400, 1400);

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, 380, 1380);

      ctx.fillStyle = '#0D9488';
      ctx.fillRect(10, 10, 380, 50);

      ctx.save();
      ctx.translate(200, 700);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AZOLE 400 mg • ' + text, 0, 0);
      ctx.font = '30px monospace';
      ctx.fillStyle = '#64748B';
      ctx.fillText('GTIN: 06111234567890 | LOT: B2024-X88', 0, 50);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 4;
      return texture;
    };

    const createTopTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 400;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 1024, 400);

      // Tamper-evident seal band
      ctx.fillStyle = '#0D9488';
      ctx.fillRect(360, 0, 304, 400);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TAMPER SEAL', 512, 190);
      ctx.font = '24px monospace';
      ctx.fillText('DO NOT ACCEPT IF BROKEN', 512, 240);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Create 3D Medicine Box Mesh
    const boxGeo = new THREE.BoxGeometry(2.7, 3.8, 0.95);
    const frontMat = new THREE.MeshStandardMaterial({
      map: createFrontTexture(),
      roughness: 0.25,
      metalness: 0.05,
    });
    const backMat = new THREE.MeshStandardMaterial({
      map: createFrontTexture(),
      roughness: 0.3,
      metalness: 0.05,
    });
    const sideMat = new THREE.MeshStandardMaterial({
      map: createSideTexture('LAPROPHAN'),
      roughness: 0.3,
    });
    const topMat = new THREE.MeshStandardMaterial({
      map: createTopTexture(),
      roughness: 0.3,
    });

    const materials = [
      sideMat, // right
      sideMat, // left
      topMat,  // top
      topMat,  // bottom
      frontMat, // front
      backMat,  // back
    ];

    const boxMesh = new THREE.Mesh(boxGeo, materials);
    scene.add(boxMesh);

    // Initial angle
    boxMesh.rotation.x = 0.12;
    boxMesh.rotation.y = -0.35;

    // Animated 3D Laser Scanning Beam
    const laserGeo = new THREE.PlaneGeometry(3.0, 0.08);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.position.z = 0.52;
    boxMesh.add(laserMesh);
    boxMesh.add(laserLight);

    // Floating 3D Medicine Capsules in orbit
    const capsuleGroup = new THREE.Group();
    scene.add(capsuleGroup);

    const capCylinderGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 32);
    const capSphereGeo = new THREE.SphereGeometry(0.25, 32, 16);
    const capsuleMaterials: THREE.Material[] = [];

    const makeCapsule = (colorA: number, colorB: number, scale: number) => {
      const group = new THREE.Group();

      const matA = new THREE.MeshStandardMaterial({ color: colorA, roughness: 0.2, metalness: 0.1 });
      const matB = new THREE.MeshStandardMaterial({ color: colorB, roughness: 0.2, metalness: 0.1 });
      capsuleMaterials.push(matA, matB);

      const topMesh = new THREE.Mesh(capCylinderGeo, matA);
      const capTop = new THREE.Mesh(capSphereGeo, matA);
      capTop.position.y = 0.2;

      const botMesh = new THREE.Mesh(capCylinderGeo, matB);
      botMesh.position.y = -0.4;
      const capBot = new THREE.Mesh(capSphereGeo, matB);
      capBot.position.y = -0.6;

      group.add(topMesh, capTop, botMesh, capBot);
      group.scale.set(scale, scale, scale);
      return group;
    };

    const pill1 = makeCapsule(0x0d9488, 0xffffff, 0.65);
    pill1.position.set(-2.4, 1.8, 1.2);
    pill1.rotation.set(0.6, 0.4, 0.8);
    capsuleGroup.add(pill1);

    const pill2 = makeCapsule(0x10b981, 0xffffff, 0.55);
    pill2.position.set(2.5, -1.6, 1.0);
    pill2.rotation.set(-0.5, 0.9, -0.4);
    capsuleGroup.add(pill2);

    // Interactive mouse rotation variables
    let targetRotX = 0.12;
    let targetRotY = -0.35;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    let isHovering = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      isHovering = true;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX + deltaY * 0.008));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotY = -0.35 + x * 0.7;
        targetRotX = 0.12 + y * 0.5;
      }
    };

    const handlePointerLeave = () => {
      if (!isDragging) {
        isHovering = false;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {}
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerUp = (e?: PointerEvent) => {
      isDragging = false;
      isHovering = false;
      if (e && container.hasPointerCapture(e.pointerId)) {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle natural idle sway when not actively dragging
      let finalTargetY = targetRotY;
      let finalTargetX = targetRotX;
      if (!isDragging && !isHovering) {
        finalTargetY = -0.35 + Math.sin(elapsed * 0.7) * 0.18;
        finalTargetX = 0.12 + Math.cos(elapsed * 0.5) * 0.08;
      }

      // Smooth interpolation for mouse orientation
      boxMesh.rotation.x = THREE.MathUtils.lerp(boxMesh.rotation.x, finalTargetX, 0.08);
      boxMesh.rotation.y = THREE.MathUtils.lerp(boxMesh.rotation.y, finalTargetY, 0.08);

      // Subtle breathing float
      boxMesh.position.y = Math.sin(elapsed * 1.5) * 0.1;

      // Laser sweep animation (up and down across box)
      const laserY = Math.sin(elapsed * 2.2) * 1.7;
      laserMesh.position.y = laserY;
      laserLight.position.set(0, laserY, 0.7);

      // Full 3D orbital animation for floating capsules
      const orbitSpeed1 = 0.8;
      pill1.position.x = Math.cos(elapsed * orbitSpeed1) * 2.5;
      pill1.position.z = Math.sin(elapsed * orbitSpeed1) * 1.6;
      pill1.position.y = 1.6 + Math.sin(elapsed * 1.5) * 0.25;
      pill1.rotation.x += 0.014;
      pill1.rotation.y += 0.018;

      const orbitSpeed2 = 0.65;
      pill2.position.x = Math.cos(elapsed * orbitSpeed2 + Math.PI) * 2.6;
      pill2.position.z = Math.sin(elapsed * orbitSpeed2 + Math.PI) * 1.6;
      pill2.position.y = -1.5 + Math.cos(elapsed * 1.3) * 0.25;
      pill2.rotation.x -= 0.012;
      pill2.rotation.z += 0.015;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      boxGeo.dispose();
      Array.from(new Set(materials)).forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
      capCylinderGeo.dispose();
      capSphereGeo.dispose();
      Array.from(new Set(capsuleMaterials)).forEach((m) => m.dispose());
      laserGeo.dispose();
      laserMat.dispose();
      laserLight.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      className="relative flex items-center justify-center p-4 sm:p-6 select-none"
    >
      {/* Background radial glow */}
      <div className="absolute h-80 w-80 rounded-full bg-gradient-to-tr from-teal-400/20 via-cyan-300/15 to-emerald-400/10 blur-3xl pointer-events-none -z-10" />

      {/* Floating Pill 1: Top-Left (Product recognized) */}
      <div className="absolute -top-2 sm:top-4 -left-3 sm:-left-6 z-30 animate-float-1 pointer-events-auto">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/95 border border-emerald-500/30 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xl shadow-emerald-950/10 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-emerald-700 text-[11px] leading-tight flex items-center gap-1">
              ✓ Product recognized (AMMPS)
            </div>
            <div className="text-[10px] text-slate-500 font-mono">AMMPS Registry ID #920342</div>
          </div>
        </div>
      </div>

      {/* Floating Pill 2: Top-Right (Manufacturer matched) */}
      <div className="absolute -top-4 sm:top-2 -right-3 sm:-right-6 z-30 animate-float-2 pointer-events-auto">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/95 border border-teal-500/30 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xl shadow-teal-950/10 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-600 border border-teal-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-teal-800 text-[11px] leading-tight">
              ✓ Manufacturer matched
            </div>
            <div className="text-[10px] text-slate-500">Promopharm / Laprophan</div>
          </div>
        </div>
      </div>

      {/* Floating Pill 3: Bottom-Left (Batch recognized) */}
      <div className="absolute -bottom-3 sm:bottom-4 -left-4 sm:-left-8 z-30 animate-float-2 pointer-events-auto">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/95 border border-emerald-500/30 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xl shadow-emerald-950/10 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-emerald-700 text-[11px] leading-tight">
              ✓ Batch recognized
            </div>
            <div className="text-[10px] text-slate-500 font-mono">LOT: B2024-X88 (Valid)</div>
          </div>
        </div>
      </div>

      {/* Floating Pill 4: Bottom-Right (Packaging anomaly detected - amber warning) */}
      <div className="absolute -bottom-4 sm:bottom-2 -right-4 sm:-right-8 z-30 animate-float-1 pointer-events-auto">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/95 border border-amber-500/30 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xl shadow-amber-950/10 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-amber-700 text-[11px] leading-tight flex items-center gap-1">
              ⚠ Packaging anomaly detected
            </div>
            <div className="text-[10px] text-slate-500">Active CV Tamper Scan</div>
          </div>
        </div>
      </div>

      {/* Three.js 3D WebGL Canvas Container */}
      <div className="relative cursor-grab active:cursor-grabbing">
        {/* HUD Crosshairs */}
        <div className="hud-corner-tl -top-2 -left-2 z-20" />
        <div className="hud-corner-tr -top-2 -right-2 z-20" />
        <div className="hud-corner-bl -bottom-2 -left-2 z-20" />
        <div className="hud-corner-br -bottom-2 -right-2 z-20" />

        <div
          ref={mountRef}
          className="w-72 sm:w-80 h-[380px] sm:h-[440px] rounded-2xl overflow-hidden touch-none"
          title="Interactive Three.js 3D Medicine Box: Drag to rotate, hover to interact"
        />

        {/* 3D Interaction hint badge */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 border border-slate-200 px-3 py-1 text-[10px] font-mono text-slate-500 shadow-sm pointer-events-none flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
          <span>Three.js 3D • Drag to inspect box</span>
        </div>
      </div>
    </div>
  );
}

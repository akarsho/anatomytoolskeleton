var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.y = 0;
camera.position.x = 0;
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer({antialias: true});

let mouse = new THREE.Vector2();
let click = false;
let raycaster = new THREE.Raycaster();

let bone_objects = []

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// responsive
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', () => {click = true;}, false);
window.addEventListener('mouseup', () => {click = false;}, false);
window.addEventListener('keydown', function(e) {
    if(e.key = 'escape')
    {
        camera.position.set(0,0,5);
        camera.rotation.set(0,0,0);
        this.alert("Reset camera")
    }
})

const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// Instantiate a loader
const loader = new THREE.OBJLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
loadSkeletonMesh()

// Setting up lighting
const pl = new THREE.PointLight(0xffffff, 2, 8, 2);
pl.position.set(2,2,2);
const plHelper = new THREE.PointLightHelper(pl, 0.5);
scene.add(pl, plHelper);

const pl2 = new THREE.PointLight(0xffffff, 2, 8, 2);
pl2.position.set(-2,-2,-2);
const pl2Helper = new THREE.PointLightHelper(pl2, 0.5);
scene.add(pl2, pl2Helper);



// Animate if needed 
function animate(time) {
    resetBones();
    hoverSkeleton();
    TWEEN.update(time)
    requestAnimationFrame( animate );
    render();
}

function onMouseMove(event)
{
    mouse.x = (event.clientX/ window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function hoverSkeleton()
{
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bone_objects);
    //scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000) );
    for(let i = 0; i < intersects.length; i++)
    {
        if(i == 0)
        { 
            if(intersects[i].object.material instanceof Array)
            {
                if(click)
                {
                    changeDescription(intersects[i].object.name);
                    dollyZoom(intersects[i].object);
                    console.log(intersects[i].object);
                    for(let j = 0; j < intersects[i].object.material.length; j++)
                    {
                        intersects[i].object.material[j].color.set(0xFFFF00);
                        intersects[i].object.material[j].opacity = 1;
                    }
                }
                else
                {
                    for(let j = 0; j < intersects[i].object.material.length; j++)
                    {
                        intersects[i].object.material[j].color.set(0xff0000);
                    }
                }
            }
            else
            {
                if(click)
                {
                    changeDescription(intersects[i].object.name);
                    dollyZoom(intersects[i].object);
                    console.log(intersects[i].object);
                    intersects[i].object.material.color.set(0xFFFF00);
                    intersects[i].object.material.opacity = 1;

                }
                else
                {
                    intersects[i].object.material.color.set(0xff0000);
                }
                
            }
        }
    }
}

function changeDescription(name)
{
    name = name.toLowerCase();
    if(name.includes("talus")){
        document.getElementById("titles").textContent = "The talus"
        document.getElementById("description").textContent = "The talus is a small bone that sits between the heel bone (calcaneus) and the two bones of the lower leg (the tibia and fibula). It has an irregular, humped shape like a turtle's shell. The bones of the lower leg ride on top and around the sides to form the ankle joint."
    }
    else if(name.includes("fibula")){
        document.getElementById("titles").textContent = "The fibula"
        document.getElementById("description").textContent = "fibula, outer of two bones of the lower leg or hind limb, presumably so named (fibula is Latin for “brooch”) because the inner bone, the tibia, and the fibula together resemble an ancient brooch, or pin. In humans the head of the fibula is joined to the head of the tibia by ligaments and does not form part of the knee."
    }
    else if(name.includes("tibia")){
        document.getElementById("titles").textContent = "The tibia"  
        document.getElementById("description").textContent = "The tibia is the shinbone, the larger of the two bones in the lower leg. The top of the tibia connects to the knee joint and the bottom connects to the ankle joint. Although this bone carries the majority of the body's weight, it still needs the support of the fibula."
    }
    else if(name.includes("patella")){
        document.getElementById("titles").textContent = "The patella"
        document.getElementById("description").textContent = "The patella is the largest sesamoid bone in the human body and is located anterior to knee joint within the tendon of the quadriceps femoris muscle, providing an attachment point for both the quadriceps tendon and the patellar ligament."
    }
    else if(name.includes("femur")){
        document.getElementById("titles").textContent = "The femur"
        document.getElementById("description").textContent = "The femur is your thigh bone. It's the longest, strongest bone in your body. It's a critical part of your ability to stand and move. Your femur also supports lots of important muscles, tendons, ligaments and parts of your circulatory system."
    }
    else if(name.includes("hip_bone")){
        document.getElementById("titles").textContent = "The hip bone"
        document.getElementById("description").textContent = "The adult os coxae, or hip bone, is formed by the fusion of the ilium, the ischium, and the pubis, which occurs by the end of the teenage years. The 2 hip bones form the bony pelvis, along with the sacrum and the coccyx, and are united anteriorly by the pubic symphysis."
    }
    else if(name.includes("coccyx")){
        document.getElementById("titles").textContent = "The coccyx"
        document.getElementById("description").textContent = "The coccyx is a triangular arrangement of bone that makes up the very bottom portion of the spine below the sacrum. It represents a vestigial tail, hence the common term tailbone.        "
    }
    else if(name.includes("sacrum")){
        document.getElementById("titles").textContent = "The sacrum"
        document.getElementById("description").textContent = "The sacrum is the triangular bone just below the lumbar vertebrae. The sacrum has five segments fused together into one large bone. In the months before birth, these vertebrae grow together into one bone that forms the base of the spine and the center of the pelvis."
    }
    else if(name.includes("vertebra")){
        document.getElementById("titles").textContent = "The vertebra"
        document.getElementById("description").textContent = "The vertebrae (back bones) of the spine include the cervical spine (C1-C7), thoracic spine (T1-T12), lumbar spine (L1-L5), sacral spine (S1-S5), and the tailbone. Each vertebra is separated by a disc. The vertebrae surround and protect the spinal cord."
    }
    else if(name.includes("rib") && name.includes("costal")){
        document.getElementById("titles").textContent = "The costal cartilage"
        document.getElementById("description").textContent = "The costal cartilages are bars of hyaline cartilage that serve to prolong the ribs forward and contribute to the elasticity of the walls of the thorax. Costal cartilage is only found at the anterior ends of the ribs, providing medial extension."
    }
    else if(name.includes("rib") && !(name.includes("costal"))){
        document.getElementById("titles").textContent = "The ribs"
        document.getElementById("description").textContent = "The rib cage surrounds the lungs and the heart, serving as an important means of bony protection for these vital organs.In total, the rib cage consists of the 12 thoracic vertebrae and the 24 ribs, in addition to the sternum."
    }
    else if(name.includes("radius")){
        document.getElementById("titles").textContent = "The radius"
        document.getElementById("description").textContent = "The radius or radial bone is one of the two large bones of the forearm, the other being the ulna. It extends from the lateral side of the elbow to the thumb side of the wrist and runs parallel to the ulna. The ulna is usually slightly longer than the radius, but the radius is thicker."
    }
    else if(name.includes("ulna")){
        document.getElementById("titles").textContent = "The ulna"
        document.getElementById("description").textContent = "The ulna is one of two bones that make up the forearm, the other being the radius. It forms the elbow joint with the humerus and also articulates with the radius both proximally and distally. It is located in the medial forearm when the arm is in the anatomical position."
    }
    else if(name.includes("metacarpal")){
        document.getElementById("titles").textContent = "The metacarpal group"
        document.getElementById("description").textContent = "In human anatomy, the metacarpal bones or metacarpus form the intermediate part of the skeletal hand located between the phalanges of the fingers and the carpal bones of the wrist, which forms the connection to the forearm. The metacarpal bones are analogous to the metatarsal bones in the foot."
    }
    else if(name.includes("distal_phalanx")){
        document.getElementById("titles").textContent = "The distal phalanx group"
        document.getElementById("description").textContent = "The distal phalanx of the finger is the distal or third of the three bones in each finger when counting from the hand to the tip of the finger. The distal phalanx has a joint just with the middle phalanx. On the tip of the phalanx is a bulbous tuft of bone that helps give the finger its rounded appearance."
    }
    else if(name.includes("proximal_phalanx")){
        document.getElementById("titles").textContent = "The proximal phalanx group"
        document.getElementById("description").textContent = "The proximal phalanx of the fingers is the proximal, or first bone, in the fingers when counting from the hand to the tip of the finger. There are three phalanges in each finger."
    }
    else if(name.includes("middle_phalanx")){
        document.getElementById("titles").textContent = "The middle phalanx group"
        document.getElementById("description").textContent = "The middle phalanges (hand), also known as the intermediate phalanges, are bones located in the fingers. Each intermediate phalanx connects to a proximal and distal phalanx. Each proximal phalanx is jointed to the metacarpal bone located in the palm, while each distal phalanx serves as the tip of a finger, as well as the home of the fingernail. This middle phalanx has two joints, and allows the finger to bend in two places. The intermediate phalanges are unique to fingers."
    }
    else if(name.includes("humerus")){
        document.getElementById("titles").textContent = "The humerus"
        document.getElementById("description").textContent = "The humerus is the largest bone of the upper extremity and defines the human brachium (arm). It articulates proximally with the glenoid via the glenohumeral (GH) joint and distally with the radius and ulna at the elbow joint."
    }
    else if(name.includes("scapula")){
        document.getElementById("titles").textContent = "The scapula"
        document.getElementById("description").textContent = "The scapula or shoulder blade is the bone that connects the clavicle to the humerus. The scapula forms the posterior of the shoulder girdle. It is a sturdy, flat, triangular bone."
    }
    else if(name.includes("xiphoid")){
        document.getElementById("titles").textContent = "The xiphoid"
        document.getElementById("description").textContent = "The xiphoid process is the smallest region of the sternum, or breastbone. It's made up of cartilage at birth but develops into bone in adulthood. It's located where the lower ribs attach to the breastbone. The tip of the xiphoid process resembles a sword."
    }
    else if(name.includes("sternum")){
        document.getElementById("titles").textContent = "The sternum"
        document.getElementById("description").textContent = "The sternum is a partially T-shaped vertical bone that forms the anterior portion of the chest wall centrally. The sternum is divided anatomically into three segments: manubrium, body, and xiphoid process. The sternum connects the ribs via the costal cartilages forming the anterior rib cage."
    }
    else if(name.includes("clavicle")){
        document.getElementById("titles").textContent = "The clavicle"
        document.getElementById("description").textContent = "The clavicle is the bone that connects the breastplate (sternum) to the shoulder. It is a very solid bone that has a slight S-shape and can be easily seen in many people. It connects to the sternum at a joint with cartilage called the sternoclavicular joint."
    }
    else if(name.includes("middle_phalanx")){
        document.getElementById("titles").textContent = "The middle phalanx"
        document.getElementById("description").textContent = "The middle phalanx of the finger is the middle or second of the three bones in each finger when counting from the hand to the tip of the finger. The middle phalanx has joints with the proximal phalanx and with the distal phalanx of the finger."
    }
    else if(name.includes("mandible")){
        document.getElementById("titles").textContent = "The mandible / jaw"
        document.getElementById("description").textContent = "The mandible is the largest bone in the human skull. It holds the lower teeth in place, it assists in mastication and forms the lower jawline. The mandible is composed of the body and the ramus and is located inferior to the maxilla. The body is a horizontally curved portion that creates the lower jawline."
    }
    else if(name.includes("maxilla")){
        document.getElementById("titles").textContent = "The maxilla"
        document.getElementById("description").textContent = "The maxilla is the bone that forms your upper jaw. The right and left halves of the maxilla are irregularly shaped bones that fuse together in the middle of the skull, below the nose, in an area known as the intermaxillary suture. The maxilla is a major bone of the face."
    }
    else if(name.includes("frontal_bone")){
        document.getElementById("titles").textContent = "The frontal bone"
        document.getElementById("description").textContent = "The frontal bone is one of the eight bones that together form the cranium, otherwise known as the protective case of the brain. The primary functions of the frontal bone are to protect the brain and support the structures of the head, such as the nasal passages and eyes."
    }
    else if(name.includes("zygomatic")){
        document.getElementById("titles").textContent = "The zygomatic bones"
        document.getElementById("description").textContent = "zygomatic bone, also called cheekbone, or malar bone, diamond-shaped bone below and lateral to the orbit, or eye socket, at the widest part of the cheek. It adjoins the frontal bone at the outer edge of the orbit and the sphenoid and maxilla within the orbit."
    }
    else if(name.includes("temporal")){
        document.getElementById("titles").textContent = "The temporal bones"
        document.getElementById("description").textContent = "The temporal bones are two major bones in the skull, or cranium. They help form the sides and base of the skull, where they protect the temporal lobe of the brain and surround the ear canal. The other major bones in the skull are: the two parietal bones that make up the top of the skull."
    }

}

function dollyZoom(obj)
{
    //console.log(obj.centroid)

    const coords = {x: camera.position.x, y: camera.position.y, z: camera.position.z}
    // console.log(coords)
    // console.log(obj.position.x, obj.position.y, obj.position.z);
    new TWEEN.Tween(coords).to({x: obj.position.x, y: obj.position.y, z:obj.position.z+0.5}).easing(TWEEN.Easing.Quadratic.Out).onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)).start();
}

function resetBones()
{
    for(let i = 0; i < bone_objects.length; i++)
    {
        if(bone_objects[i].material instanceof Array)
        {
            for(let j = 0; j < bone_objects[i].material.length; j++)
            {
                bone_objects[i].material[j].color.set(0xffffff); 
            }       
        }
        else
        {
            bone_objects[i].material.color.set(0xffffff);      
        }
        
    }
}



function render()
{
    renderer.render( scene, camera );
}

function loadSkeletonMesh()
{
    loader.load('./data/skeleton stuff/clavicle.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/coccyx.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/costalcartilage.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/cricoid.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/distal phalanx.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/extra cartilage.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/femur.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/fibula.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/front face.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/frontal.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/hipbone.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/humerus.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/hyoid.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/inside skull.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/mandible.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/manubrium.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/metacarpals.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/middle phalanx.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/occipital.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/parietal.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/patella.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/proximal phalanx.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/radius.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/ribs.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/sacrum.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/scapula.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/sphenoid.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/spine.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/sternum.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/talus.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/teeth.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/temporal.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/thyroid.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/tibia.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/ulna.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/vomer.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/wrist.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );

    loader.load('./data/skeleton stuff/xiphoid.obj',
        function ( object ) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.computeBoundingBox();
                    let matrix = new THREE.Vector3();
                    let offset = child.geometry.boundingBox.getCenter(matrix);
                    child.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
                    child.position.copy(offset);
                    bone_objects.push(child)
                }
            });
            scene.add(object);
        }
    );
}

animate();

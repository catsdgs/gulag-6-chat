const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var words = ['day', 'mom', 'spot', 'rain', 'rice', 'bridge', 'lake', 'smell', 'throat', 'ice', 'wire', 'morning', 'creature', 'roof', 'turn', 'front', 'bulb', 'minute', 'dock', 'mint', 'crow', 'space', 'hobbies', 'school', 'church', 'cushion', 'birthday', 'mountain', 'grade', 'pipe', 'cat', 'structure', 'hand', 'control', 'relation', 'value', 'exchange', 'horse', 'zebra', 'mine', 'coal', 'caption', 'bear', 'tramp', 'collar', 'knee', 'carriage', 'quilt', 'shame', 'jump', 'beef', 'test', 'representative', 'wax', 'price', 'railway', 'cup', 'pan', 'activity', 'death', 'branch', 'thing', 'sea', 'cherry', 'babies', 'bat', 'flavor', 'shoes', 'yam', 'expert', 'adjustment', 'brick', 'dress', 'bead', 'purpose', 'gun', 'event', 'dolls', 'pull', 'wave', 'hose', 'loss', 'eyes', 'afternoon', 'coach', 'horses', 'wilderness', 'knife', 'scissors', 'cap', 'slip', 'cough', 'skin', 'night', 'dirt', 'grass', 'pancake', 'blade', 'fruit', 'shirt', 'committee', 'health', 'camera', 'bed', 'slope', 'bikes', 'sack', 'wrist', 'spoon', 'square', 'rest', 'rat', 'chicken', 'drop', 'color', 'riddle', 'beginner', 'tray', 'punishment', 'mouth', 'flag', 'scent', 'dinosaurs', 'cakes', 'steam', 'start', 'verse', 'weight', 'whip', 'street', 'step', 'blow', 'icicle', 'selection', 'need', 'partner', 'vegetable', 'rock', 'pigs', 'fear', 'trick', 'sneeze', 'bag', 'oatmeal', 'calculator', 'division', 'skate', 'jail', 'bell', 'insurance', 'frame', 'sail', 'sky', 'baby', 'star', 'cactus', 'spade', 'worm', 'wish', 'flowers', 'son', 'hair', 'zoo', 'scarf', 'competition', 'cable', 'tent', 'fang', 'house', 'soda', 'science', 'land', 'women', 'minister', 'silver', 'summer', 'mask', 'door', 'stitch', 'page', 'duck', 'base', 'window', 'tomatoes', 'reading', 'curtain', 'earthquake', 'pump', 'bells', 'destruction', 'mind', 'cast', 'condition', 'hands', 'grip', 'request', 'flower', 'fact', 'salt', 'friends', 'wren', 'distribution', 'queen', 'agreement', 'lace', 'children', 'knowledge', 'form', 'flock', 'lumber', 'river', 'flight', 'frog', 'army', 'doctor', 'stranger', 'guide', 'stomach', 'sisters', 'friction', 'vase', 'daughter', 'juice', 'drink', 'produce', 'jam', 'rhythm', 'thrill', 'crib', 'bird', 'apparel', 'tin', 'team', 'hydrant', 'sponge', 'smoke', 'hook', 'plants', 'driving', 'match', 'card', 'religion', 'boot', 'robin', 'account', 'shake', 'size', 'ball', 'bedroom', 'pig', 'veil', 'sun', 'arithmetic', 'dad', 'blood', 'noise', 'edge', 'crowd', 'motion', 'rule', 'addition', 'tax', 'ants', 'paper', 'furniture', 'passenger', 'chess', 'rake', 'tub', 'underwear', 'oranges', 'trousers', 'harbor', 'nose', 'shape', 'authority', 'respect', 'story', 'territory', 'calendar', 'digestion', 'woman', 'comparison', 'stretch', 'lip', 'kettle', 'rod', 'town', 'channel', 'cream', 'porter', 'screw', 'work', 'low', 'note', 'jellyfish', 'cow', 'north', 'push', 'mass', 'instrument', 'wood', 'gate', 'surprise', 'bite', 'poison', 'theory', 'sock', 'country', 'can', 'watch', 'cart', 'act', 'example', 'mice', 'jeans', 'belief', 'invention', 'system', 'kitty', 'border', 'income', 'flesh', 'yarn', 'popcorn', 'rub', 'art', 'recess', 'kiss', 'thought', 'waste', 'needle', 'island', 'hill', 'substance', 'shoe', 'maid', 'market', 'shock', 'brother', 'teeth', 'sidewalk', 'point', 'engine', 'liquid', 'orange', 'quartz', 'argument', 'position', 'history', 'cows', 'money', 'clover', 'snakes', 'hospital', 'thumb', 'toothbrush', 'spy', 'appliance', 'clam', 'winter', 'badge', 'grape', 'judge', 'copper', 'plane', 'scale', 'volcano', 'teaching', 'birds', 'fairies', 'property', 'plot', 'oven', 'wine', 'bee', 'ray', 'nest', 'club', 'cannon', 'degree', 'peace', 'trip', 'alarm', 'talk', 'run', 'donkey', 'throne', 'attack', 'planes', 'quince', 'self', 'carpenter', 'pollution', 'cake', 'back', 'ocean', 'soup', 'effect', 'wind', 'finger', 'tree', 'yak', 'observation', 'swing', 'cook', 'advertisement', 'string', 'laborer', 'thread', 'top', 'skirt', 'zephyr', 'eggnog', 'cub', 'ground', 'writing', 'suggestion', 'houses', 'trouble', 'book', 'current', 'measure', 'wheel', 'dinner', 'lettuce', 'seed', 'stone', 'language', 'table', 'swim', 'rabbits', 'grandfather', 'room', 'range', 'drain', 'head', 'sweater', 'increase', 'girl', 'tendency', 'war', 'mist', 'machine', 'pin', 'scarecrow', 'playground', 'look', 'eggs', 'waves', 'year', 'song', 'harmony', 'cheese', 'use', 'grain', 'plantation', 'wash', 'glass', 'pie', 'station', 'egg', 'basketball', 'stocking', 'love', 'sign', 'food', 'debt', 'plate', 'jar', 'pencil', 'coil', 'rabbit', 'twig', 'prose', 'sofa', 'eye', 'wing', 'amount', 'pear', 'believe', 'hour', 'camp', 'letters', 'direction', 'writer', 'sleep', 'nation', 'hammer', 'insect', 'name', 'aftermath', 'birth', 'meat', 'truck', 'stop', 'rainstorm', 'kick', 'change', 'crayon', 'berry', 'number', 'straw', 'cave', 'profit', 'secretary', 'ticket', 'existence', 'notebook', 'turkey', 'sugar', 'toothpaste', 'deer', 'silk', 'ink', 'cracker', 'acoustics', 'roll', 'hope', 'route', 'iron', 'office', 'receipt', 'chance', 'sticks', 'design', 'care', 'stew', 'basin', 'visitor', 'wall', 'pizzas', 'transport', 'reaction', 'limit', 'shade', 'nut', 'slave', 'industry', 'locket', 'support', 'button', 'basket', 'snake', 'van', 'ladybug', 'quiver', 'hall', 'picture', 'muscle', 'payment', 'tank', 'earth', 'library', 'distance', 'giants', 'baseball', 'wound', 'giraffe', 'class', 'curve', 'gold', 'walk', 'pies', 'level', 'butter', 'toy', 'detail', 'bike', 'quarter', 'boat', 'month', 'guitar', 'sink', 'pleasure', 'growth', 'bushes', 'idea', 'chin', 'stem', 'tail', 'ear', 'bone', 'sound', 'wealth', 'mitten', 'snails', 'stick', 'bath', 'business', 'unit', 'spiders', 'celery', 'train', 'sister', 'stamp', 'oil', 'person', 'plough', 'smile', 'fold', 'coast', 'friend', 'title', 'letter', 'breath', 'elbow', 'beds', 'steel', 'treatment', 'foot', 'airport', 'parcel', 'cellar', 'record', 'apparatus', 'fish', 'balance', 'afterthought', 'advice', 'cover', 'squirrel', 'rate', 'reward', 'order', 'question', 'creator', 'sort', 'knot', 'trail', 'fowl', 'vest', 'seat', 'snow', 'drawer', 'behavior', 'fire', 'plant', 'quill', 'place', 'loaf', 'quiet', 'canvas', 'error', 'fork', 'neck', 'heat', 'hat', 'moon', 'sense', 'plastic', 'discovery', 'building', 'air', 'hate', 'angle', 'humor', 'things', 'middle', 'voyage', 'crown', 'legs', 'chickens', 'side', 'quicksand', 'volleyball', 'crime', 'pail', 'glove', 'trade', 'weather', 'lunchroom', 'sheet', 'crack', 'wrench', 'meeting', 'snail', 'horn', 'regret', 'connection', 'taste', 'ducks', 'field', 'boy', 'memory', 'boundary', 'brake', 'expansion', 'box', 'view', 'kittens', 'ghost', 'corn', 'home', 'potato', 'credit', 'haircut', 'meal', 'vacation', 'downtown', 'touch', 'root', 'tiger', 'way', 'servant', 'toad', 'men', 'trucks', 'crook', 'pest', 'leg', 'water', 'pickle', 'cherries', 'arch', 'marble', 'holiday', 'smash', 'cars', 'texture', 'toe', 'bucket', 'offer', 'arm', 'desire', 'force', 'ring', 'line', 'uncle', 'party', 'stove', 'cemetery', 'dime', 'sheep', 'car', 'cent', 'board', 'action', 'powder', 'bit', 'brass', 'bait', 'discussion', 'metal', 'toys', 'vessel', 'geese', 'zipper', 'seashore', 'animal', 'aunt', 'cause', 'stage', 'government', 'ship', 'cabbage', 'nerve', 'crate', 'lock', 'pen', 'suit', 'fly', 'scene', 'shop', 'experience', 'dogs', 'trains', 'rail', 'pets', 'floor', 'sleet', 'group', 'umbrella', 'achiever', 'rings', 'statement', 'face', 'frogs', 'spring', 'pot', 'whistle', 'dust', 'thunder', 'wool', 'chalk', 'hole', 'anger', 'spark', 'week', 'attraction', 'protest', 'airplane', 'tongue', 'honey', 'governor', 'laugh', 'hot', 'twist', 'decision', 'key', 'grandmother', 'rifle', 'desk', 'doll', 'songs', 'power', 'jewel', 'magic', 'yoke', 'bottle', 'vein', 'amusement', 'jelly', 'mailbox', 'store', 'bomb', 'man', 'sand', 'flame', 'girls', 'actor', 'interest', 'tooth', 'cattle', 'reason', 'word', 'road', 'time', 'development', 'trees', 'lunch', 'lamp', 'leather', 'mark', 'battle', 'join', 'fall', 'temper', 'fuel', 'linen', 'part', 'soap', 'company', 'pet', 'books', 'pocket', 'yard', 'impulse', 'move', 'show', 'end', 'cats', 'farm', 'fireman', 'toes', 'coat', 'cobweb', 'circle', 'bubble', 'monkey', 'dog', 'fog', 'society', 'mother', 'feeling', 'shelf', 'burst', 'play', 'approval', 'rose', 'milk', 'stream', 'voice', 'zinc', 'cloth', 'education'];
var word = " " + words[Math.floor(Math.random() * words.length)];
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newMessage', {
  //     from: 'abc',
  //     text: 'def',
  //     createdAt: 123
  // });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Room Name and Display Name are required. Please check to see if you entered the Room Name and your Display Name correctly.');
    }
    if (users.getUserList(params.room).includes(params.name) === true) {
      return callback('Someone in this room already has this name. Please change it.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //socket.leave('The Office Fans');

    // io.emiting - sending to everyone
    // socket.broadcast.emit - sending to everyone except for current user
    // socket.emit - emits specificly to the socket user

    // io.emit -> io.to('The office fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The office fans').emit
    // socket.emit

    //greeting
    socket.emit('newMessage', generateMessage('SERVER', `Welcome to the Goolag chatting service! Please remember to hide your ${word}.`));

    //new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('SERVER', `${params.name} has joined or opened their Chromebook. You better hide your ${word}.`));

    callback();
  });


  //server side event acknowledgement sent to client (browser)
  socket.on('createMessage', (message, callback) => {
    //console.log('Created message', message);
    //io.emit emits event to every connection

    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
    }

    callback();
    //broadcasting - emiting an event to everyone exept specific user
    //sockets tells to which user event will not be emitted
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    //console.log('User disconnected');
    var user = users.removeUser(socket.id);

    if (user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('SERVER', `${user.name} has left or closed their Chromebook. You can now show off your ${word}`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

/*
function Node(x, y, h, g, parent) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.g = g;
    this.f = h + g;
    this.parent = parent;
}
*/

class QElement { 
    constructor(element, priority) { 
        this.element = element; 
        this.priority = priority; 
    } 
} 

class PriorityQueue { 
  
    // An array is used to implement priority 
    constructor() { 
        this.items = []; 
    } 
  
    // functions to be implemented 
    // enqueue(item, priority) 
    enqueue(element, priority) { 
        // creating object from queue element 
        var qElement = new QElement(element, priority); 
        var contain = false; 
    
        // iterating through the entire 
        // item array to add element at the 
        // correct location of the Queue 
        for (var i = 0; i < this.items.length; i++) { 
            if (this.items[i].priority > qElement.priority) { 
                // Once the correct location is found it is 
                // enqueued 
                this.items.splice(i, 0, qElement); 
                contain = true; 
                break; 
            } 
        } 
    
        // if the element have the highest priority 
        // it is added at the end of the queue 
        if (!contain) { 
            this.items.push(qElement); 
        } 
    }
    
    insert(element, priority) { 
        let contain = false;
        for (var i = 0; i < this.items.length && !contain; i++) { 
            if (this.items[i].row == element.row && this.items[i].col == element.col) { 
                if (this.items[i].priority > priority) {
                    this.items[i] = new QElement(element, priority);
                    contain = true;
                }
            } 
        } 
        if (!contain) {
            this.enqueue(element, priority);
        }
    } 

    dequeue() { 
        // return the dequeued element 
        // and remove it. 
        // if the queue is empty 
        // returns Underflow 
        if (this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    }

    front() { 
        // returns the highest priority element 
        // in the Priority queue without removing it. 
        if (this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    }

    isEmpty() { 
        // return true if the queue is empty. 
        return this.items.length == 0; 
    }

} 

class Node {
    constructor(row, col, h, g, parent, penality) {
        this.row    = row;
        this.col    = col;
        this.h      = h;
        this.g      = g;
        this.f      = h + g + penality;
        this.parent = parent;
    }
}

function g(row1, col1, row2, col2) {
    return Math.sqrt(Math.pow(row1 - row2, 2)+Math.pow(col1 - col2, 2));
}

function findNode(list, coord){
    for (i in list) {
        if (coord[0] == list[i][0] && coord[1] == list[i][1])
            return i;
    }

    return null;
}

function astar(map, start, end, blocks) {
    let openList  = new PriorityQueue();;
    let closeList = blocks.slice();;
    startNode = new Node(start[0], start[1], 0, g(start[0], start[1], end[0], end[1], map[start[0], start[1]]), null);
    openList.enqueue(startNode, startNode.f);
    let moves = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ];

    while (!openList.isEmpty()) {
        let currentNode = openList.dequeue().element;
        closeList.push([currentNode.row, currentNode.col]);

        if (currentNode.row == end[0] && currentNode.col == end[1]) {
            let path = [];

            while (currentNode != null) {
                path.unshift(currentNode);
                currentNode = currentNode.parent;
            }

            return path;
        }

        moves.forEach((move, index) => {
            let child = [currentNode.row + move[0], currentNode.col + move[1]];
            if (child[0] >= 0 && child[1] >= 0 && child[0] < map.length && child[1] < map[0].length) {
                let childNode;
                if(findNode(closeList, child)==null) {
                    if ((move[0] == -1 && move[1] == -1) || (move[0] == 1 && move[1] == -1) || (move[0] == -1 && move[1] == 1) || (move[0] == 1 && move[1] == 1))
                        childNode = new Node(child[0], child[1], currentNode.h + Math.sqrt(2), g(child[0], end[0], child[1], end[1]), currentNode, map[child[0]][child[1]]);
                    else
                        childNode = new Node(child[0], child[1], currentNode.h + 1, g(child[0], end[0], child[1], end[1]), currentNode, map[child[0]][child[1]]);
                    
                    openList.insert(childNode, childNode.f);
                }

            }
        });

    }
    return [];
    //console.log(openList.front());
}
/*
let map = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let map = [
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0]
]
*/
//console.log(astar(map, [1, 1], [4, 7]));


/*
let n1 = new Node(1, 2, 0, g(1, 2, 1, 3), null);
let n2 = new Node(1, 3, 1, g(1, 3, 1, 4), n1);
console.log(n1);
console.log(n2);
*/
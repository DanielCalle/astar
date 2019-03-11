$( document ).ready(function() {

    var selectedButton = null;
    var start = null;
    var end = [];
    var blocks = [];
    var totalRows;
    var totalCols;
    var map = [];

    $("#astarButtonCreateMap").click(function() {
        $("#step1").hide();
        $("#step2").show();
        $("#astarButtons").show();
        totalRows = $("#astarInputRows").val();
        totalCols = $("#astarInputColumns").val();
        for (let i = 0; i < totalRows; i++) {
            map.push([]);
            for (let j = 0; j < totalCols; j++) {
                map[map.length-1].push(0);
            }
        }
    

        $("#astarButtonStart").click(function() {
            console.log(selectedButton);
            if (selectedButton == "run")
                clean();
            
            $("#astarButtons").children().each(function() {
                $(this).prop("disabled",false);
            });
            $(this).prop("disabled",true);
            selectedButton = $(this).attr("action");
        });

        $("#astarButtonEnd").click(function() {
            if (selectedButton == "run")
                clean();
        
            $("#astarButtons").children().each(function() {
                $(this).prop("disabled",false);
            });
            $(this).prop("disabled",true);
            selectedButton = $(this).attr("action");
        });

        $("#astarButtonBlock").click(function() {
            if (selectedButton == "run")
                clean();
        
            $("#astarButtons").children().each(function() {
                $(this).prop("disabled",false);
            });
            $(this).prop("disabled",true);
            selectedButton = $(this).attr("action");
        });

        $("#astarButtonPenalty").click(function() {
            if (selectedButton == "run")
                clean();
        
            $("#astarButtons").children().each(function() {
                $(this).prop("disabled",false);
            });
            $(this).prop("disabled",true);

            selectedButton = $(this).attr("action");
        });

        $("#astarButtonRun").click(function() {
            $("#astarButtons").children().each(function() {
                $(this).prop("disabled",false);
            });
            $(this).prop("disabled",true);
            if (start != null && end != null) {
                let path = [];
                let posible = true;
                let currentStart = start;
                
                for (let i = 0; i < end.length && posible; i++) {
                    path.push(astar(map, currentStart, end[i], blocks));
                    currentStart = end[i];
                    if (path[path.length-1].length == 0)
                        posible = false;
                }

                if (!posible)
                    alert("You can not find a path");
                else {
                    selectedButton = $(this).attr("action");
                    let count = 0;
                    for (let i = 0; i < path.length;i++)
                        for (let j = 1; j < path[i].length -1;j++) {
                            ++count;
                            setTimeout(function () {
                                let td =  $("#astarTable > tr > td[row=\""+ path[i][j].row +
                                "\"][col=\""+ path[i][j].col + "\"] ");
                                $(td).css("background-color","green");
                                $(td).css("background-image", "url(\"img/robot_run.gif\")");
                                setTimeout(function () { $(td).css("background-image", ""); }, 300);
                            }, 300*count);

                        }
                }

            }
        });

        for (let i = 0; i < totalRows; i++) {
            $("#astarTable").append($("<tr></tr>"));
            for (let j = 0; j < totalCols; j++) {
                $("#astarTable > tr").last().append($('<td></td>')
                    .attr({ width : ((1/totalCols)*100) + "%",
                            row : i,
                            col : j
                        })
                    .css("font-size", "4em")
                    .addClass("content")
                    .addClass("text-center")
                    .click(action)
                )
            }
        }
    });

    function clean() {
        $("#astarTable > tr > td").each(function () {
            $(this).css("background-color","");
            $(this).html("");
        });
        start = null;
        end = [];
        blocks = [];
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                map[i][j] = 0;
            }
        }
    }

    function action() {
        let row = parseInt($(this).attr("row"), 10);
        let col = parseInt($(this).attr("col"), 10);
        switch(selectedButton) {
            case "start":
                if (!(end != null && row==end[0] && col==end[1])) {
                    if (start != null)
                        $("#astarTable > tr > td[row=\""+ start[0] + "\"][col=\""+ start[1] + "\"] ").css("background-color","");

                    $(this).css("background-color","blue");
                    start = [row,col];
                }
            break;
            case "end":
                if (!(start != null && row==start[0] && col==start[1])) {
                    if ((index = findNode(end,[row,col]))!=null) {
                        $("#astarTable > tr > td[row=\""+ row + "\"][col=\""+ col + "\"] ").css("background-color","");
                        end.splice(index, 1)
                    } else {
                        $(this).css("background-color","yellow");
                        end.push([row,col]);
                    }
                }

            break;
            case "block":
                content = false
                if (!(start != null && row==start[0] && col==start[1]) &&
                    !(end != null && findNode(end, [row, col]))) {
                    for (let i=0; i<blocks.length && !content; i++) {
                        if (blocks[i][0] == row && blocks[i][1] == col) {
                            $(this).css("background-color","");
                            blocks.splice(i, 1);
                            content = true;
                        }
                    }
                    if (!content) {
                        $(this).css("background-color","red");
                        blocks.push([row,col]);
                    }
                }
            break;
            case "penalty":
                if (!(start != null && row==start[0] && col==start[1]) &&  findNode(end, [row, col]) == null && findNode(blocks, [row, col]) == null) {
                    let penalty = parseInt($(this).html(), 10);
                    if (isNaN(penalty))
                        penalty = 0;
                    
                    map[row][col] = penalty + 1;
                    $(this).html(map[row][col]);
                }
        }
    }

});


:- module(sudoku, [solve/1, generate/1]).

:- use_module(library(clpfd)).

:- use_module(library(random)).

sudoku(Rows) :-
    length(Rows, 9), maplist(same_length(Rows), Rows),
    append(Rows, Vs), Vs ins 1..9,
    maplist(all_distinct, Rows),
    transpose(Rows, Columns),
    maplist(all_distinct, Columns),
    Rows = [A,B,C,D,E,F,G,H,I],
    blocks(A, B, C), blocks(D, E, F), blocks(G, H, I).
    
    
blocks([], [], []).
blocks([A,B,C|Bs1], [D,E,F|Bs2], [G,H,I|Bs3]) :-
    all_distinct([A,B,C,D,E,F,G,H,I]),
    blocks(Bs1, Bs2, Bs3).

solve(Rows) :-
    sudoku(Rows),
    maplist(label, Rows), writeln(Rows).

initialize_random_grid(Grid) :-
    Numbers = [1,2,3,4,5,6,7,8,9],
    random_permutation(Numbers, RandomFirstRow),
    Grid = [RandomFirstRow, R2, R3, R4, R5, R6, R7, R8, R9],
    maplist(same_length(Numbers), Grid).

generate(Grid) :-
    initialize_random_grid(Grid),
    solve(Grid).

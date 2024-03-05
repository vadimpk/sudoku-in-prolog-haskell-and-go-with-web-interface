:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_error)).
:- use_module(library(http/http_cors)).

:- use_module(sudoku).


:- http_handler('/solve', handle_solve_sudoku, []).
:- http_handler('/generate', handle_generate_sudoku, []).

handle_solve_sudoku(Request) :-
    http_read_json_dict(Request, DictIn),
    dict_to_sudoku_grid(DictIn, Grid),
    (   sudoku:solve(Grid) ->
        GridOut = Grid,
        Status = 200
    ;   GridOut = "No solution",
        Status = 400
    ),
    reply_json_dict(GridOut, [status(Status)]).


dict_to_sudoku_grid(Dict, Grid) :-
    Rows = Dict.get(grid),
    maplist(row_to_prolog, Rows, Grid).

row_to_prolog(RowIn, RowOut) :-
    maplist(cell_to_prolog, RowIn, RowOut).

cell_to_prolog(Cell, _) :- var(Cell), !.
cell_to_prolog(null, _) :- !.
cell_to_prolog(Cell, Cell).


handle_generate_sudoku(Request) :-
    sudoku:generate(Grid),
    transform_grid_for_json(Grid, TransformedGrid),
    reply_json_dict(TransformedGrid, [status(200)]).

% Transforms a Prolog grid, replacing uninstantiated variables with null
transform_grid_for_json(Grid, TransformedGrid) :-
    maplist(transform_row_for_json, Grid, TransformedGrid).

transform_row_for_json(Row, TransformedRow) :-
    maplist(transform_cell_for_json, Row, TransformedRow).

transform_cell_for_json(Cell, null) :- var(Cell), !.
transform_cell_for_json(Cell, Cell).

start_server(Port) :-
    http_server(http_dispatch, [port(Port)]).

:- initialization(start_server(8080)).

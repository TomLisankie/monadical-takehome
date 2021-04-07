BOARD_SIZE = 7

def check_for_horizontal_win(board):
    for row in range(BOARD_SIZE):
        start_column = 0
        end_column = 4
        while end_column != BOARD_SIZE + 1:
            board_slice = board[row][start_column : end_column]
            piece_set = set(board_slice)
            if len(piece_set) == 1 and next(iter(piece_set)) != "___":
                return True
            start_column += 1
            end_column += 1
    return False

def check_for_vertical_win(board):
    # rotate board 90 degrees
    rotated_board = []
    for i in range(BOARD_SIZE):
        new_row = []
        for j in range(BOARD_SIZE):
            new_row.append(board[j][i])
        rotated_board.append(new_row)
    # on the rotated board, all wins that would have previously been vertical are now horizontal
    return check_for_horizontal_win(rotated_board)

def check_for_left_diagonal_win(board):
    rows_to_check = [-1, 0, 1, 2]
    columns_to_check = [0, 1, 2, 3]
    end_column = max(columns_to_check)
    for row in range(BOARD_SIZE - len(rows_to_check) + 1):
        rows_to_check = list(map(lambda x : x + 1, rows_to_check))
        columns_to_check = [0, 1, 2, 3]
        end_column = max(columns_to_check)
        while end_column != BOARD_SIZE:
            positions_to_check = list(zip(rows_to_check, columns_to_check))
            values_on_diagonal = set(map(lambda pos : board[pos[0]][pos[1]], positions_to_check))
            if len(values_on_diagonal) == 1 and next(iter(values_on_diagonal)) != "___":
                return True
            columns_to_check = list(map(lambda x : x + 1, columns_to_check))
            end_column = max(columns_to_check)
    return False

def check_for_right_diagonal_win(board):
    rows_to_check = [-1, 0, 1, 2]
    columns_to_check = [3, 2, 1, 0]
    end_column = max(columns_to_check)
    for row in range(BOARD_SIZE - len(rows_to_check) + 1):
        rows_to_check = list(map(lambda x : x + 1, rows_to_check))
        columns_to_check = [3, 2, 1, 0]
        end_column = max(columns_to_check)
        while end_column != BOARD_SIZE:
            positions_to_check = list(zip(rows_to_check, columns_to_check))
            values_on_diagonal = set(map(lambda pos : board[pos[0]][pos[1]], positions_to_check))
            if len(values_on_diagonal) == 1 and next(iter(values_on_diagonal)) != "___":
                return True
            columns_to_check = list(map(lambda x : x + 1, columns_to_check))
            end_column = max(columns_to_check)
    return False

def check_for_win(board):
    return check_for_horizontal_win(board) or check_for_vertical_win(board) or check_for_left_diagonal_win(board) or check_for_right_diagonal_win(board)

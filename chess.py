from aiohttp import web
import socketio
import easygui
import os
import re

sio = socketio.AsyncServer(async_mode='aiohttp', cors_allowed_origins="*")
app = web.Application()
sio.attach(app)

isFind = False
exe = "./stockfish/stockfish"

for root, dirs, files in os.walk('.'):
    for dir in dirs:
        if re.match(r'stockfish', dir):
          for root, dirs, files in os.walk(os.path.join(root, dir)):
            for file in files:
              if re.match(r'stockfish.*\.exe', file):
                dir_without_ext = os.path.splitext(file)[0]
                print(os.path.join(root, dir_without_ext))
                exe = os.path.join(root, dir_without_ext)
                isFind = True

if isFind == False:
  path = easygui.fileopenbox("Select stockfish.exe", "Stockfish-Integration", filetypes=[[".exe", "Select Stockfish"]])
  if (path == None): exit()
  exe = os.path.splitext(path)[0]

fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"

@sio.event
async def chess(sid, data):
  print(data)
  if "fen" not in data or "isAlternative" not in data or "Elo" not in data:
    return "Error"
  bestmove = getBestMove(data["fen"], data["isAlternative"], data["Elo"])
  print(bestmove)
  return bestmove

@sio.event
async def connect(sid, environ):
    print(sid)


@sio.event
async def disconnect(sid):
    print('Client disconnected')


def getBestMove(fen, isAlternative, elo):
  from stockfish import Stockfish 
  stockfish = Stockfish(path=exe, depth=20, parameters={"UCI_Elo": elo, "UCI_LimitStrength": True})
  if stockfish.is_fen_valid(fen) == False:
    return False
  stockfish.set_fen_position(fen)
  if isAlternative == "true":
    bestmove = stockfish.get_top_moves(2)
  else:
    bestmove = stockfish.get_top_moves(1)
  return bestmove

if __name__ == '__main__':
    web.run_app(app, port=8000) 
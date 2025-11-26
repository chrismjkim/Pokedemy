from datetime import datetime
import pandas as pd
import requests
import json

# URL 상수 (cId: 매치 별로 부여된 고유 해시값 / rst: 현재 시즌이면 0, 과거 시즌이면 2)
URL_SEASONS = "https://api.battle.pokemon-home.com/tt/cbd/competition/rankmatch/list"
URL_TRAINER = "https://resource.pokemon-home.com/battledata/ranking/scvi/{cid}/{rst}/{ts}/traner-{idx}"
URL_POKEMON = "https://resource.pokemon-home.com/battledata/ranking/scvi/{cid}/{rst}/{ts}/pokemon"
URL_PDETAIL = "https://resource.pokemon-home.com/battledata/ranking/scvi/{cid}/{rst}/{ts}/pdetail-{idx}"

# pokemon HOME의 https 프로토콜 상의 문자열을 코딩 시 이해하기 쉽게 상수로 지정
INFO, MOVE, ABILITY, NATURE, ITEM, POKEMON = 'temoti','waza', 'tokusei', 'seikaku', 'motimono', 'pokemon'

headers = {
    "Host": "resource.pokemon-home.com",
    "Connection": "close",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:78.0) AppleWebKit/537.36 (KHTML, like Gecko)",
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://resource.pokemon-home.com/battledata/rankmatch_detail.html",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
}

df_ability = pd.read_csv("tables/ability.csv")
df_item = pd.read_csv("tables/item.csv")
df_move = pd.read_csv("tables/move.csv")
df_nature = pd.read_csv("tables/nature.csv")
df_pokemon = pd.read_csv("tables/pokemon.csv")
df_type = pd.read_csv("tables/type.csv")

def check_response(_URL):
    response = requests.get(_URL, headers=headers)
    if response.status_code != 200:
            raise Exception("서버로부터 정상적인 응답을 받지 못했습니다. HTTP 응답 코드 {}".format(response.status_code))
    try:
        response = json.loads(response.text)
    except:
        raise Exception("서버로부터 받은 응답을 읽어들이지 못했습니다.\n{}".format(response.text))
    
    return response

def load_pokemon_info(pokemon) -> pd.DataFrame:
    id, form = pokemon['id'], pokemon['form']
    return df_pokemon[(df_pokemon['pokemon_species_id'] == id) & (df_pokemon['form'] == form)]

def load_item_info(item) -> pd.DataFrame:
    return df_item[(df_item['id'] == int(item['id']))]

def load_move_info(move) -> pd.DataFrame:
    return df_move[df_move['id'] == int(move['id'])]

def load_ability_info(ability) -> pd.DataFrame:
    return df_ability[(df_ability['id'] == int(ability['id']))]

def load_nature_info(nature) -> pd.DataFrame:
    return df_nature[df_nature['id'] == int(nature['id'])]

def load_terastal_info(terastal) -> pd.DataFrame:
    return df_type[(df_type['id'] == int(terastal['id']))]

def fetch_seasons() -> dict : 
    ''' 모든 시즌의 목록을 json으로 받아옴'''
    extra_headers = {
        "Host": "api.battle.pokemon-home.com",
        "countrycode": "305", #Korea
        "langcode": "8", #KOR
        "Authorization": "Bearer",
        "X-Requested-With": "jp.pokemon.pokemonhome",
        "Sec-Fetch-Site": "same-site"
    }
    
    data = {
        "soft": "Sc" # Pokemon SV
    }
    
    response = requests.post(URL_SEASONS, headers={**headers, **extra_headers}, json=data)
    if response.status_code != 200:
        raise Exception(f"서버로부터 정상적인 응답을 받지 못했습니다. HTTP 응답 코드 {response.status_code}")
    
    try:
        response = json.loads(response.text)
    except:
        raise Exception(f"서버로부터 받은 응답을 읽어들이지 못했습니다.\n{response.text}")
    
    if response["code"] != 200:
        raise Exception(f"서버로부터 정상적인 응답을 받지 못했습니다. 내부 응답 코드 {response["code"]}")
    return json.loads(response["list"])

# 한 시즌에서 싱글배틀 또는 더블배틀의 cId 값을 꺼내옴
def get_cId(season_num, rule):
    # all_seasons[season_num] -> dict
    for match_cId, match_info in all_seasons[season_num].items():
        if match_info['rule'] == int(rule):
            return match_cId

class SeasonBattleData:
    def __init__(self, match_season, match_rule):
        
        # 시즌 정보 관련
        self.match_prefix = '싱글' if match_rule == '0' else '더블' # 0 -> 싱글, 1 -> 더블
        self.match_cID = get_cId(match_season, match_rule) # cId로 받아오기
        self.match = all_seasons[match_season][self.match_cID]
        
    def info(self):
        
        match = self.match
        
        print(f" ####### {match["name"]} {match_prefix}배틀 정보 #######")
        
        print("시즌 이름:", match['name'])
        print("시즌 시작:", match['start'])
        print("시즌 종료:", match['end'])
        print("참여자 수:", match['cnt'])
        
        print("플레이어 순위 집계 기준:", datetime.fromtimestamp(match['ts1']).strftime("%Y년 %m월 %d일 %H시 %M분 %S초"))
        print("포켓몬 순위 집계 기준:", datetime.fromtimestamp(match['ts2']).strftime("%Y년 %m월 %d일 %H시 %M분 %S초"))
        print('\n')
    
    def fetch_trainers_rank(self, index):
        # index -> (순위 // 1000) + 1
        #       -> 간단하게 생각하면 순위 1,000위 당 1씩 증가
        
        _URL = URL_TRAINER.format(
            cid = self.match['cId'],
            rst = self.match['rst'],
            ts = self.match['ts1'],
            idx = index
        )
        
        return check_response(_URL)
    
    def show_trainers_rank(self, top_n):
        
        print(f"##### {self.match["name"]} {match_prefix}배틀 TOP {top_n} 트레이너 #####")
        
        trainers = self.fetch_trainers_rank(1)
        for i in range(0, top_n):
            trainer = trainers[i]
            print(f"{trainer['rank']}위 ({trainer['rating_value']})- {trainer['name']}")
        print('\n')
    
    def fetch_pokemons_rank(self):
        _URL = URL_POKEMON.format(
            cid = self.match['cId'],
            rst = self.match['rst'],
            ts = self.match['ts2'],
        )
        return check_response(_URL)
    
    def show_pokemons_rank(self, top_n):
        print(f"##### {self.match["name"]} {match_prefix}배틀 TOP {top_n} 포켓몬 #####")
        pokemons =  self.fetch_pokemons_rank()
        for i in range(0, top_n):
            pokemon = load_pokemon_info(pokemons[i])
            print(f"{i} 포켓몬: {pokemon['name_ko'].iloc[0]} ({pokemon['type_1'].iloc[0]}, {pokemon['type_2'].iloc[0]})")
        print('\n')

    def show_pokemon_details(self, pokemon_id, form_id):
        return self.PokemonDetails(self.match, pokemon_id, form_id)

    class PokemonDetails:
        def __init__(self, match, pokemon_id, form_id):
            self.match = match
            details = self.fetch_pokemon_details()
            self.detail = details[str(pokemon_id)][str(form_id)]
            self.info = self.detail[INFO]
            self.win = self.detail['win']
            self.lose = self.detail['lose']
        
        def fetch_pokemon_details(self):
            details = {}
            
            # i 1당 포켓몬 200마리까지를 조회하게 되고, 포켓몬 전체 마릿수는 1024마리이므로 총 i는 0, 1, 2, 3, 4, 5까지 늘어나야 함
            for i in range(0, 6):
                _URL = URL_PDETAIL.format(
                    cid = self.match['cId'],
                    rst = self.match['rst'],
                    ts = self.match['ts2'],
                    idx = i + 1
                )
                response = check_response(_URL)
                try:
                    details.update(response)
                except:
                    raise Exception("서버로부터 받은 응답을 읽어들이지 못했습니다.\n{}".format(response.text))
            return details
        
        def team_members(self):
            print("### 함께 배틀팀에 포함된 포켓몬 ###")
            members = self.info[POKEMON]
            for i, party_data in enumerate(members):
                party = load_pokemon_info(party_data)
                print(f"{i+1}위 - {party['name_ko']} (폼번호 {party['form']})")
            print("\n")
            
            return self

        def items(self):
            print("### 도구 ###")
            items = self.info[ITEM]
            for i, item_data in enumerate(items):
                item = load_item_info(item_data)
                print(f"{i+1}위 - {item['name_ko']} ({item_data['val']}%)")
            print("\n")
            
            return self

        def moves(self):
            print("### 기술 ###")
            moves = self.info[MOVE]
            for i, move_data in enumerate(moves):
                move = load_move_info(move_data)
                print(f"{i+1}위 - {move['name_ko']} ({move_data['val']}%)")
                print(move['effect_entry_ko'])
            print("\n")
            
            return self

        def natures(self):
            print("### 성격 ###")
            natures = self.info[NATURE]
            for i, nature_data in enumerate(natures):
                nature = load_nature_info(nature_data)
                print(f"{i+1}위 - {nature['name_ko']} ({nature_data['val']}%)")
            print("\n")
            
            return self

        def abilities(self):
            print("### 특성 ###")
            abilities = self.info[ABILITY]
            for i, ability_data in enumerate(abilities):
                ability = load_ability_info(ability_data)
                print(f"{i+1}위 - {ability['name_ko']} ({ability_data['val']}%)")
                print(ability['effect_entry_ko'])
            print("\n")
            
            return self

        def terastal_types(self):
            print("### 테라스탈 타입 ###")
            items = self.info['terastal']
            for i, item_data in enumerate(items):
                item = load_terastal_info(item_data)
                print(f"{i+1}위 - {item['name_ko']} ({item_data['val']}%)")
            print("\n")
            
            return self

        def wins(self):
            print("### 내가 쓰러트린 포켓몬 TOP 10 ###")
            for i, poke_data in enumerate(self.win[POKEMON]):
                pokemon = load_pokemon_info(poke_data)
                print(f"{i+1}위 - {pokemon['name_ko']} (폼번호 {pokemon['form']})")
            print("\n")
            
            return self

        def win_moves(self):
            print("### 내가 쓰러트린 기술 TOP 10 ###")
            for i, move_data in enumerate(self.win[MOVE]):
                move = load_move_info(move_data)
                print(f"{i+1}위 - {move['name_ko']} ({move_data['val']}%)")
            print("\n")
            
            return self

        def defeats(self):
            print("### 나를 쓰러트린 포켓몬 TOP 10 ###")
            for i, poke_data in enumerate(self.lose[POKEMON]):
                pokemon = load_pokemon_info(poke_data)
                print(f"{i+1}위 - {pokemon['name_ko']} (폼번호 {pokemon['form']})")
            print("\n")
            
            return self

        def defeat_moves(self):
            print("### 나를 쓰러트린 기술 TOP 10 ###")
            for i, move_data in enumerate(self.lose[MOVE]):
                move = load_move_info(move_data)
                print(f"{i+1}위 - {move['name_ko']} ({move_data['val']}%)")
            print("\n")
            
            return self



# -----------------------------------------------------------------------------------------------------------------------

if __name__ == "__main__":
    
    all_seasons = fetch_seasons()
    
    # 분석할 시즌 입력
    match_season = '34' # 시즌 15
    match_rule = '0' # 싱글배틀 정보 (싱글: 0, 더블: 1)
    match_prefix = '싱글' if match_rule == '0' else '더블' # 0 -> 싱글, 1 -> 더블
    
    match = SeasonBattleData(match_season, match_rule)
    
    # 분석할 포켓몬 입력
    pokemon_id = 888 # int도 가능
    form_id = 1 # int도 가능
    
    # 불러올 순위의 수
    top_n = 150
    
    # match.info()
    # match.show_trainers_rank(top_n)
    # match.show_pokemons_rank(top_n) 
    # match.show_pokemon_details(pokemon_id, form_id).moves() 
# Create your models here.
from django.db import models


class Region(models.Model):
    """지방"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    slug = models.SlugField()

class Ability(models.Model):
    """특성"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_jp = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    effect_entry = models.CharField(max_length=1000, null=True, blank=True)
    effect_entry_ko = models.CharField(max_length=1000, null=True, blank=True)
    effect_detail = models.TextField(null=True, blank=True)
    introduced_generation_id = models.ForeignKey('Generation', on_delete=models.SET_NULL, null=True, blank=True, db_column='introduced_generation_id')

class BerryFlavor(models.Model):
    """나무열매 맛"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class FieldCondition(models.Model):
    """배틀 중 필드 상태"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class MoveFieldCondition(models.Model):
    """기술이 변화시키는 필드 상태"""
    move_id = models.ForeignKey('Move', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_id')
    field_condition_id = models.ForeignKey('FieldCondition', on_delete=models.SET_NULL, null=True, blank=True, db_column='field_condition_id')

class Nature(models.Model):
    """성격"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    raise_stat_id = models.ForeignKey('Stat', on_delete=models.SET_NULL, null=True, blank=True, db_column='raise_stat_id', related_name='raise_stat')
    lower_stat_id = models.ForeignKey('Stat', on_delete=models.SET_NULL, null=True, blank=True, db_column='lower_stat_id', related_name='lower_stat')
    like_berry_flavor_id = models.ForeignKey('BerryFlavor', on_delete=models.SET_NULL, null=True, blank=True, db_column='like_berry_flavor_id', related_name='like_berry_flavor')
    dislike_berry_flavor_id = models.ForeignKey('BerryFlavor', on_delete=models.SET_NULL, null=True, blank=True, db_column='dislike_berry_flavor_id', related_name='dislike_berry_flavor')

class PokemonSpecies(models.Model):
    """포켓몬 종"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    evolves_from_species_id = models.IntegerField(null=True, blank=True)
    evolution_chain_id = models.IntegerField(null=True, blank=True)
    gender_rate = models.IntegerField(null=True, blank=True)
    base_happiness = models.IntegerField(null=True, blank=True)
    is_baby = models.BooleanField(null=True, blank=True)
    hatch_counter = models.IntegerField(null=True, blank=True)
    growth_rate_id = models.ForeignKey('GrowthRate', on_delete=models.SET_NULL, null=True, blank=True, db_column='growth_rate_id')

class PokemonFormVariation(models.Model):
    """포켓몬 폼의 외형 바리에이션"""
    id = models.IntegerField(primary_key=True)
    pokemon_id = models.ForeignKey('Pokemon', on_delete=models.SET_NULL, null=True, blank=True, db_column='pokemon_id')
    form_variation = models.IntegerField(null=True, blank=True)
    form_variation_name = models.CharField(max_length=1000, null=True, blank=True)
    form_variation_name_ko = models.CharField(max_length=1000, null=True, blank=True)
    is_default = models.BooleanField(null=True, blank=True)
    introduced_in_version_group_id = models.IntegerField(null=True, blank=True)

class Pokemon(models.Model):
    """포켓몬과 포켓몬"""
    id = models.IntegerField(primary_key=True)
    cid = models.IntegerField(null=True, blank=True)
    pokemon_species_id = models.ForeignKey('PokemonSpecies', on_delete=models.SET_NULL, null=True, blank=True, db_column='pokemon_species_id')
    form = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    is_independent = models.BooleanField(null=True, blank=True)
    hp = models.IntegerField(null=True, blank=True)
    attack = models.IntegerField(null=True, blank=True)
    defense = models.IntegerField(null=True, blank=True)
    special_attack = models.IntegerField(null=True, blank=True)
    special_defense = models.IntegerField(null=True, blank=True)
    speed = models.IntegerField(null=True, blank=True)
    total = models.IntegerField(null=True, blank=True)
    type1_id = models.ForeignKey('Type', on_delete=models.SET_NULL, null=True, blank=True, db_column='type1_id', related_name='type1')
    type2_id = models.ForeignKey('Type', on_delete=models.SET_NULL, null=True, blank=True, db_column='type2_id', related_name='type2')
    ability1_id = models.ForeignKey('Ability', on_delete=models.SET_NULL, null=True, blank=True, db_column='ability1_id', related_name='ability1')
    ability2_id = models.ForeignKey('Ability', on_delete=models.SET_NULL, null=True, blank=True, db_column='ability2_id', related_name='ability2')
    ability_hidden_id = models.ForeignKey('Ability', on_delete=models.SET_NULL, null=True, blank=True, db_column='ability_hidden_id', related_name='ability_hidden')
    height = models.IntegerField(null=True, blank=True)
    weight = models.IntegerField(null=True, blank=True)
    base_experience = models.IntegerField(null=True, blank=True)
    capture_rate = models.IntegerField(null=True, blank=True)
    effort_hp = models.IntegerField(null=True, blank=True)
    effort_atk = models.IntegerField(null=True, blank=True)
    effort_def = models.IntegerField(null=True, blank=True)
    effort_spa = models.IntegerField(null=True, blank=True)
    effort_spd = models.IntegerField(null=True, blank=True)
    effort_spe = models.IntegerField(null=True, blank=True)
    is_battle_only = models.BooleanField(null=True, blank=True)
    is_mega = models.BooleanField(null=True, blank=True)
    is_gmax = models.BooleanField(null=True, blank=True)
    is_region_form = models.BooleanField(null=True, blank=True)

class PokemonMove(models.Model):
    """포켓몬이 배우는 기술"""
    pokemon_id = models.ForeignKey('Pokemon', on_delete=models.SET_NULL, null=True, blank=True, db_column='pokemon_id')
    version_group_id = models.ForeignKey('VersionGroup', on_delete=models.SET_NULL, null=True, blank=True, db_column='version_group_id')
    move_id = models.ForeignKey('Move', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_id')
    learn_method_id = models.ForeignKey('LearnMethod', on_delete=models.SET_NULL, null=True, blank=True, db_column='learn_method_id')
    level = models.IntegerField(null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)
    mastery_level = models.IntegerField(null=True, blank=True)

class LearnMethod(models.Model):
    """기술 습득 경로"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class Stat(models.Model):
    """능력치"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class Type(models.Model):
    """타입"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class Item(models.Model):
    """도구"""
    id = models.IntegerField(primary_key=True)
    hex = models.CharField(max_length=1000, null=True, blank=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    is_holdable = models.BooleanField(null=True, blank=True)
    fling_power = models.IntegerField(null=True, blank=True)
    fling_status_condition_id = models.ForeignKey('StatusCondition', on_delete=models.SET_NULL, null=True, blank=True, db_column='fling_status_condition_id')
    item_category_id = models.ForeignKey('ItemCategory', on_delete=models.SET_NULL, null=True, blank=True, db_column='item_category_id')
    effect = models.CharField(max_length=1000, null=True, blank=True)
    sprite_id = models.IntegerField(null=True, blank=True)

class ItemCategory(models.Model):
    """도구 카테고리"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class DamageClass(models.Model):
    """기술 분류"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class Move(models.Model):
    """기술"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_jp = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    effect_entry = models.TextField(null=True, blank=True)
    effect_entry_ko = models.CharField(max_length=1000, null=True, blank=True)
    type_id = models.ForeignKey('Type', on_delete=models.SET_NULL, null=True, blank=True, db_column='type_id')
    damage_class_id = models.ForeignKey('DamageClass', on_delete=models.SET_NULL, null=True, blank=True, db_column='damage_class_id')
    power = models.IntegerField(null=True, blank=True)
    accuracy = models.IntegerField(null=True, blank=True)
    pp = models.IntegerField(null=True, blank=True)
    priority = models.IntegerField(null=True, blank=True)
    move_target_id = models.ForeignKey('MoveTarget', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_target_id')
    is_contact = models.BooleanField(null=True, blank=True)
    crit_rate = models.IntegerField(null=True, blank=True)
    drain = models.IntegerField(null=True, blank=True)
    healing = models.IntegerField(null=True, blank=True)
    min_hits = models.IntegerField(null=True, blank=True)
    max_hits = models.IntegerField(null=True, blank=True)
    introduced_in_generation_id = models.IntegerField(null=True, blank=True)

class MoveStatusCondition(models.Model):
    """기술이 유발하는 상태변화"""
    move_id = models.ForeignKey('Move', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_id')
    status_condition_id = models.ForeignKey('StatusCondition', on_delete=models.SET_NULL, null=True, blank=True, db_column='status_condition_id')
    status_condition_chance = models.FloatField(null=True, blank=True)

class MoveStatChange(models.Model):
    """기술이 유발하는 능력치 변화"""
    move_id = models.ForeignKey('Move', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_id')
    stat_id = models.ForeignKey('Stat', on_delete=models.SET_NULL, null=True, blank=True, db_column='stat_id')
    stat_target_id = models.ForeignKey('MoveTarget', on_delete=models.SET_NULL, null=True, blank=True, db_column='stat_target_id')
    stat_change_rank = models.IntegerField(null=True, blank=True)
    stat_change_rate = models.IntegerField(null=True, blank=True)

class MoveTarget(models.Model):
    """기술 범위"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class MoveUsageMethod(models.Model):
    """기술의 사용 방식"""
    move_id = models.ForeignKey('Move', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_id')
    move_usage_method_id = models.ForeignKey('UsageMethod', on_delete=models.SET_NULL, null=True, blank=True, db_column='move_usage_method_id')

class StatusCondition(models.Model):
    """상태변화"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    is_volatile = models.BooleanField(null=True, blank=True)

class UsageMethod(models.Model):
    """사용 방식"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class Generation(models.Model):
    """세대"""
    id = models.IntegerField(primary_key=True)
    main_region_id = models.ForeignKey('Region', on_delete=models.SET_NULL, null=True, blank=True, db_column='main_region_id')
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)

class Version(models.Model):
    """버전"""
    id = models.IntegerField(primary_key=True)
    version_group_id = models.ForeignKey('VersionGroup', on_delete=models.SET_NULL, null=True, blank=True, db_column='version_group_id')
    identifier = models.CharField(max_length=1000, null=True, blank=True)

class VersionGroup(models.Model):
    """버전 그룹"""
    id = models.IntegerField(primary_key=True)
    identifier = models.CharField(max_length=1000, null=True, blank=True)
    generation_id = models.ForeignKey('Generation', on_delete=models.SET_NULL, null=True, blank=True, db_column='generation_id')
    order = models.CharField(max_length=1000, null=True, blank=True)

class VersionGroupRegion(models.Model):
    """버전 그룹의 지방"""
    version_group_id = models.ForeignKey('VersionGroup', on_delete=models.SET_NULL, null=True, blank=True, db_column='version_group_id')
    region_id = models.IntegerField(null=True, blank=True)

class GrowthRate(models.Model):
    """경험치 그룹"""
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    name_ko = models.CharField(max_length=1000, null=True, blank=True)
    formular = models.CharField(max_length=1000, null=True, blank=True)

class Match(models.Model):
    """시즌"""
    cid = models.CharField(primary_key= True, max_length=1000)
    name = models.CharField(max_length=1000, null=True, blank=True)
    start = models.CharField(max_length=1000, null=True, blank=True)
    end = models.CharField(max_length=1000, null=True, blank=True)
    cnt = models.IntegerField(null=True, blank=True)
    rank_cnt = models.IntegerField(null=True, blank=True)
    rule = models.IntegerField(null=True, blank=True)
    season = models.IntegerField(null=True, blank=True)
    rst = models.IntegerField(null=True, blank=True)
    ts1 = models.IntegerField(null=True, blank=True)
    ts2 = models.IntegerField(null=True, blank=True)
    
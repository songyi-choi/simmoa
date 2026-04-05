export interface CardInterpretation {
  up: string;
  rev: string;
}

export interface TarotCard {
  id: number;
  number: string;
  name: string;
  nameKo: string;
  emoji: string;
  interpretations: Record<string, CardInterpretation>;
}

export interface DrawnCard {
  id: number;
  reversed: boolean;
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id:0, number:'0', name:'The Fool', nameKo:'바보', emoji:'🌟',
    interpretations:{
      general:{ up:'새로운 시작과 무한한 가능성이 당신 앞에 펼쳐져 있습니다. 두려움을 내려놓고 직감을 따라 첫 발을 내딛을 때입니다.', rev:'무모한 행동이나 준비 없는 시작을 경계해야 합니다. 충동적인 결정보다는 한 걸음 물러서서 상황을 점검할 필요가 있습니다.' },
      love_solo:{ up:'예상치 못한 만남이 다가올 수 있습니다. 편견 없이 마음을 열면 특별한 인연이 시작될 것입니다.', rev:'감정에 휩쓸려 성급한 관계를 시작하지 않도록 주의하세요.' },
      love_couple:{ up:'관계에 새로운 활력이 찾아옵니다. 함께 새로운 경험을 시도하면 더욱 깊은 유대가 형성될 것입니다.', rev:'관계에서 무책임한 태도가 갈등을 일으킬 수 있습니다.' },
      business_change:{ up:'이직의 기회가 열려 있습니다. 새로운 분야로의 도전이 좋은 결과를 가져올 수 있습니다.', rev:'충분한 준비 없이 직장을 옮기면 후회할 수 있습니다.' },
      business_promotion:{ up:'새로운 역할이나 프로젝트에서 당신의 잠재력이 빛날 수 있습니다.', rev:'승진에 대한 조급함이 오히려 발목을 잡을 수 있습니다.' },
      business_start:{ up:'창업을 위한 좋은 에너지가 흐르고 있습니다.', rev:'사업 계획이 아직 무르익지 않았습니다.' },
      wealth:{ up:'예상치 못한 금전적 행운이 찾아올 수 있습니다.', rev:'충동적인 소비나 무계획적인 투자에 주의하세요.' }
    }
  },
  {
    id:1, number:'I', name:'The Magician', nameKo:'마법사', emoji:'🎩',
    interpretations:{
      general:{ up:'당신에게는 원하는 것을 이룰 수 있는 모든 도구와 능력이 갖춰져 있습니다.', rev:'능력을 잘못된 방향으로 사용하고 있지는 않은지 점검하세요.' },
      love_solo:{ up:'당신의 매력과 자신감이 빛나는 시기입니다.', rev:'진심보다 겉모습에만 치중하고 있지는 않은지 돌아보세요.' },
      love_couple:{ up:'소통 능력이 빛을 발합니다.', rev:'관계에서 주도권을 쥐려는 태도가 갈등을 유발할 수 있습니다.' },
      business_change:{ up:'다재다능한 능력이 새 직장에서 인정받을 것입니다.', rev:'현실적인 조건을 무시한 채 환상만 좇지 않도록 하세요.' },
      business_promotion:{ up:'업무 능력과 커뮤니케이션 스킬이 상사에게 인상을 남길 것입니다.', rev:'실력보다 인상관리에만 집중하면 역효과가 날 수 있습니다.' },
      business_start:{ up:'뛰어난 아이디어와 실행력을 갖추고 있습니다.', rev:'과대 포장이나 비현실적 목표는 독이 됩니다.' },
      wealth:{ up:'재테크에 대한 감각이 살아 있습니다.', rev:'사기나 허황된 투자 제안을 조심하세요.' }
    }
  },
  {
    id:2, number:'II', name:'The High Priestess', nameKo:'여사제', emoji:'🌙',
    interpretations:{
      general:{ up:'직관과 내면의 목소리에 귀 기울일 때입니다.', rev:'직감을 무시하거나 표면적인 것에만 집착하고 있을 수 있습니다.' },
      love_solo:{ up:'아직 드러나지 않은 인연이 가까이에 있습니다.', rev:'이상화된 사랑을 꿈꾸며 현실의 좋은 인연을 놓치고 있을 수 있습니다.' },
      love_couple:{ up:'상대방의 말하지 못한 속마음을 읽어보세요.', rev:'비밀이나 숨겨진 감정이 관계에 그림자를 드리울 수 있습니다.' },
      business_change:{ up:'성급한 결정보다 관찰과 정보 수집이 우선입니다.', rev:'중요한 정보를 놓치고 있을 수 있습니다.' },
      business_promotion:{ up:'조용히 실력을 쌓아온 것이 곧 빛을 발합니다.', rev:'자신의 능력을 숨기거나 과소평가하고 있습니다.' },
      business_start:{ up:'사업 아이디어를 좀 더 숙성시킬 필요가 있습니다.', rev:'감에만 의존한 사업은 위험합니다.' },
      wealth:{ up:'숨겨진 재정적 기회를 발견할 수 있습니다.', rev:'금전 문제에서 중요한 사항을 간과하고 있을 수 있습니다.' }
    }
  },
  {
    id:3, number:'III', name:'The Empress', nameKo:'여황제', emoji:'👑',
    interpretations:{
      general:{ up:'풍요와 성장의 에너지가 충만합니다.', rev:'자기 돌봄을 소홀히 하고 있지는 않은지 점검하세요.' },
      love_solo:{ up:'매력이 넘치는 시기입니다.', rev:'사랑에 대한 집착이나 외로움에 성급한 선택을 하지 않도록 주의하세요.' },
      love_couple:{ up:'관계에 따뜻한 에너지가 흐릅니다.', rev:'관계에서 질투심이나 소유욕이 문제를 일으킬 수 있습니다.' },
      business_change:{ up:'더 나은 환경에서 당신의 능력이 꽃필 수 있습니다.', rev:'현재 환경이 불만족스럽더라도 급하게 떠나지 마세요.' },
      business_promotion:{ up:'풍요로운 성과를 거둘 수 있는 시기입니다.', rev:'성과에 비해 인정받지 못한다고 느낄 수 있습니다.' },
      business_start:{ up:'창업 아이디어가 풍성하게 열매를 맺을 수 있는 시기입니다.', rev:'아이디어만 많고 실행력이 부족할 수 있습니다.' },
      wealth:{ up:'재정적 풍요가 찾아옵니다.', rev:'과도한 소비에 주의하세요.' }
    }
  },
  {
    id:4, number:'IV', name:'The Emperor', nameKo:'황제', emoji:'🏛️',
    interpretations:{
      general:{ up:'체계와 질서를 세울 때입니다. 리더십과 안정감이 필요합니다.', rev:'지나친 통제욕이나 완고함을 경계하세요.' },
      love_solo:{ up:'안정적이고 믿음직한 파트너를 만날 수 있습니다.', rev:'이상형의 기준이 너무 엄격하지 않은지 돌아보세요.' },
      love_couple:{ up:'관계에 안정감과 신뢰가 더해집니다.', rev:'관계에서 너무 통제하려 하면 갈등이 생깁니다.' },
      business_change:{ up:'안정적이고 체계적인 조직이 당신에게 맞습니다.', rev:'변화를 두려워하지 마세요.' },
      business_promotion:{ up:'리더십 능력이 인정받을 것입니다.', rev:'권위적인 태도가 승진을 방해할 수 있습니다.' },
      business_start:{ up:'체계적인 사업 계획이 성공의 열쇠입니다.', rev:'유연성 부족이 사업에 걸림돌이 될 수 있습니다.' },
      wealth:{ up:'재정적 안정을 이룰 수 있는 시기입니다.', rev:'재정적 통제력을 잃을 수 있습니다.' }
    }
  },
  {
    id:5, number:'V', name:'The Hierophant', nameKo:'교황', emoji:'📿',
    interpretations:{
      general:{ up:'전통적인 가치와 지혜로운 조언이 도움이 됩니다.', rev:'기존의 규범에 얽매이지 말고 자신만의 길을 찾으세요.' },
      love_solo:{ up:'소개팅이나 지인의 소개로 좋은 만남이 이루어질 수 있습니다.', rev:'주변의 기대에 맞추기보다 자신의 마음에 솔직해지세요.' },
      love_couple:{ up:'관계의 공식적인 진전이 있을 수 있습니다.', rev:'형식에만 얽매인 관계는 공허합니다.' },
      business_change:{ up:'안정적이고 전통 있는 기업으로의 이직이 유리합니다.', rev:'기존 방식에 갇혀 새로운 가능성을 보지 못하고 있습니다.' },
      business_promotion:{ up:'조직 내 규범을 잘 따르고 신뢰를 쌓아온 것이 인정받습니다.', rev:'관행에만 따르기보다 창의적인 제안이 돋보일 수 있습니다.' },
      business_start:{ up:'검증된 비즈니스 모델을 따르는 것이 안전합니다.', rev:'혁신적인 접근이 필요한 시기입니다.' },
      wealth:{ up:'보수적인 투자가 좋은 수익을 가져옵니다.', rev:'자신만의 투자 철학을 세울 때입니다.' }
    }
  },
  {
    id:6, number:'VI', name:'The Lovers', nameKo:'연인', emoji:'💞',
    interpretations:{
      general:{ up:'중요한 선택의 기로에 서 있습니다. 마음의 소리를 따르세요.', rev:'갈등과 불화의 에너지가 있습니다.' },
      love_solo:{ up:'운명적인 만남의 가능성이 매우 높습니다.', rev:'이상과 현실 사이에서 갈등하고 있습니다.' },
      love_couple:{ up:'관계가 한 차원 더 깊어지는 시기입니다.', rev:'가치관 차이로 인한 갈등이 생길 수 있습니다.' },
      business_change:{ up:'마음이 끌리는 곳을 선택하세요.', rev:'핵심 가치에 따라 우선순위를 정하세요.' },
      business_promotion:{ up:'동료들과의 좋은 관계가 승진에 긍정적입니다.', rev:'인간관계 갈등이 커리어에 영향을 줄 수 있습니다.' },
      business_start:{ up:'파트너와 함께하면 좋은 시너지를 낼 수 있습니다.', rev:'동업 시 역할 분담을 명확히 하세요.' },
      wealth:{ up:'현명한 선택을 할 수 있습니다.', rev:'금전 문제로 인한 갈등이 생길 수 있습니다.' }
    }
  },
  {
    id:7, number:'VII', name:'The Chariot', nameKo:'전차', emoji:'⚡',
    interpretations:{
      general:{ up:'강한 의지로 장애물을 돌파하고 승리를 거머쥘 수 있습니다.', rev:'방향을 잃고 헤매거나 과도한 공격성이 문제를 일으킬 수 있습니다.' },
      love_solo:{ up:'적극적인 행동이 사랑을 이끌어냅니다.', rev:'정복하듯 접근하면 상대방이 부담을 느낍니다.' },
      love_couple:{ up:'함께 목표를 향해 나아가는 관계가 됩니다.', rev:'서로 다른 방향으로 가려는 갈등이 있습니다.' },
      business_change:{ up:'과감한 이직이 성공을 가져올 것입니다.', rev:'서두르면 실수합니다.' },
      business_promotion:{ up:'강한 추진력으로 성과를 내고 승진에 유리합니다.', rev:'지나친 경쟁심이 동료 관계를 해칩니다.' },
      business_start:{ up:'빠른 실행력이 사업 초기의 성공을 이끕니다.', rev:'무리한 확장은 위험합니다.' },
      wealth:{ up:'적극적인 재테크로 큰 수익을 기대할 수 있습니다.', rev:'성급한 투자가 손실을 부를 수 있습니다.' }
    }
  },
  {
    id:8, number:'VIII', name:'Strength', nameKo:'힘', emoji:'🦁',
    interpretations:{
      general:{ up:'내면의 힘과 인내심으로 어려움을 극복할 수 있습니다.', rev:'자기 의심이나 불안감이 당신을 가로막고 있습니다.' },
      love_solo:{ up:'내면의 자신감이 매력을 발산합니다.', rev:'사랑에 대한 두려움이 좋은 인연을 놓치게 합니다.' },
      love_couple:{ up:'인내와 이해로 시련을 이겨낼 수 있습니다.', rev:'감정 조절이 어려워 다툼이 잦아질 수 있습니다.' },
      business_change:{ up:'꿋꿋이 버티면 좋은 기회가 옵니다.', rev:'스트레스가 극에 달해 있을 수 있습니다.' },
      business_promotion:{ up:'꾸준한 노력이 인정받아 승진의 문이 열립니다.', rev:'자신감 부족으로 기회를 놓칠 수 있습니다.' },
      business_start:{ up:'초기 어려움을 인내로 극복하면 안정 궤도에 오릅니다.', rev:'마음의 준비가 부족합니다.' },
      wealth:{ up:'장기적인 안목으로 투자하면 좋은 결과를 얻습니다.', rev:'재정적 불안감이 잘못된 판단을 부를 수 있습니다.' }
    }
  },
  {
    id:9, number:'IX', name:'The Hermit', nameKo:'은둔자', emoji:'🏔️',
    interpretations:{
      general:{ up:'혼자만의 시간을 통해 내면을 탐구하고 지혜를 얻을 때입니다.', rev:'고립과 외로움에 빠져 있을 수 있습니다.' },
      love_solo:{ up:'자기 자신을 먼저 사랑하는 것이 최고의 연애 준비입니다.', rev:'지나친 이상을 좇으며 혼자의 세계에 갇혀 있지 마세요.' },
      love_couple:{ up:'관계에 대해 깊이 생각해볼 시간이 필요합니다.', rev:'파트너와 소통이 단절되어 있을 수 있습니다.' },
      business_change:{ up:'충분히 고민한 후에 결정하세요.', rev:'결정을 너무 오래 미루면 기회를 놓칩니다.' },
      business_promotion:{ up:'묵묵히 전문성을 쌓아온 것이 인정받습니다.', rev:'네트워킹을 소홀히 하면 승진이 어렵습니다.' },
      business_start:{ up:'혼자 깊이 연구하고 완성도를 높이세요.', rev:'혼자서 모든 것을 해결하려 하지 마세요.' },
      wealth:{ up:'검소한 생활과 저축이 장기적인 부를 만듭니다.', rev:'재정 상황을 외면하고 있을 수 있습니다.' }
    }
  },
  {
    id:10, number:'X', name:'Wheel of Fortune', nameKo:'운명의 수레바퀴', emoji:'🎡',
    interpretations:{
      general:{ up:'운명의 전환점이 다가오고 있습니다. 행운의 기운이 감쌉니다.', rev:'예상치 못한 변화나 역경이 닥칠 수 있습니다.' },
      love_solo:{ up:'운명적인 만남이 가까이 있습니다.', rev:'연애 운이 잠시 정체될 수 있지만 곧 호전됩니다.' },
      love_couple:{ up:'관계에 좋은 변화가 찾아옵니다.', rev:'예상치 못한 시련이 올 수 있습니다.' },
      business_change:{ up:'이직에 행운이 따릅니다.', rev:'예상치 못한 변수에 대비하세요.' },
      business_promotion:{ up:'운이 따라 승진이 이루어집니다.', rev:'뜻밖의 경쟁자가 나타날 수 있습니다.' },
      business_start:{ up:'사업의 타이밍이 맞아 떨어집니다.', rev:'외부 환경 변화에 주의하세요.' },
      wealth:{ up:'금전 운이 크게 상승합니다.', rev:'재정적 변동성이 클 수 있습니다.' }
    }
  },
  {
    id:11, number:'XI', name:'Justice', nameKo:'정의', emoji:'⚖️',
    interpretations:{
      general:{ up:'공정한 결과가 따르는 시기입니다.', rev:'불공정한 상황이 문제를 일으킬 수 있습니다.' },
      love_solo:{ up:'진실하고 공정한 마음으로 만남에 임하세요.', rev:'과거의 상처가 새로운 만남을 방해합니다.' },
      love_couple:{ up:'관계의 균형이 중요합니다.', rev:'불공평함을 느끼면 솔직하게 대화하세요.' },
      business_change:{ up:'정당한 대우를 받을 수 있는 곳으로 이동하세요.', rev:'법적 문제나 계약 분쟁에 주의하세요.' },
      business_promotion:{ up:'공정한 평가를 통해 승진이 이루어집니다.', rev:'평가 기준이 불투명할 수 있습니다.' },
      business_start:{ up:'법적 절차를 철저히 준비하세요.', rev:'계약 문제에서 불이익을 당하지 않도록 주의하세요.' },
      wealth:{ up:'정당한 노력에 합당한 보상이 있습니다.', rev:'금전 관련 분쟁에 주의하세요.' }
    }
  },
  {
    id:12, number:'XII', name:'The Hanged Man', nameKo:'매달린 사람', emoji:'🙃',
    interpretations:{
      general:{ up:'다른 관점에서 바라볼 때 새로운 답이 보입니다.', rev:'불필요한 희생을 멈추세요.' },
      love_solo:{ up:'사랑에 대한 기존 관념을 내려놓으세요.', rev:'지나치게 자신을 희생하지 마세요.' },
      love_couple:{ up:'상대방의 입장에서 생각해보세요.', rev:'일방적인 인내는 관계를 악화시킵니다.' },
      business_change:{ up:'지금은 기다리는 것이 최선입니다.', rev:'무한정 미루지 마세요.' },
      business_promotion:{ up:'장기적인 커리어 발전을 위해 투자하세요.', rev:'부당한 대우를 참지 마세요.' },
      business_start:{ up:'잠시 보류하고 더 나은 계획을 세우세요.', rev:'완벽한 때는 오지 않습니다. 실행하세요.' },
      wealth:{ up:'장기적인 가치에 투자하세요.', rev:'금전적 손실을 인정하고 손절하세요.' }
    }
  },
  {
    id:13, number:'XIII', name:'Death', nameKo:'죽음', emoji:'🦋',
    interpretations:{
      general:{ up:'큰 변화와 변환의 시기입니다. 끝은 새로운 시작입니다.', rev:'변화를 거부하면 정체됩니다.' },
      love_solo:{ up:'과거의 연애 패턴을 끝내고 새 시작을 하세요.', rev:'지난 사랑에 대한 미련을 놓아야 합니다.' },
      love_couple:{ up:'관계가 새로운 단계로 진화합니다.', rev:'끝내야 할 관계를 붙잡고 있지는 않은지 돌아보세요.' },
      business_change:{ up:'과감한 전환이 새로운 기회를 열어줍니다.', rev:'현재에 안주하면 성장이 멈춥니다.' },
      business_promotion:{ up:'기존 역할에서 벗어나 새로운 포지션으로 나아갑니다.', rev:'변화를 두려워하지 마세요.' },
      business_start:{ up:'완전히 새로운 도전이 필요한 시기입니다.', rev:'낡은 방식을 고수하면 실패합니다.' },
      wealth:{ up:'재정적 구조 변화가 이득을 가져옵니다.', rev:'돈에 대한 집착을 내려놓으세요.' }
    }
  },
  {
    id:14, number:'XIV', name:'Temperance', nameKo:'절제', emoji:'⚗️',
    interpretations:{
      general:{ up:'균형과 조화를 찾을 때입니다. 인내와 절제가 필요합니다.', rev:'불균형이나 과도함을 경계하세요.' },
      love_solo:{ up:'서두르지 않으면 자연스럽게 좋은 인연이 옵니다.', rev:'조급함이 관계를 그르칩니다.' },
      love_couple:{ up:'서로에 대한 이해와 타협으로 관계가 깊어집니다.', rev:'한쪽에 치우친 관계는 오래가지 못합니다.' },
      business_change:{ up:'서두르지 말고 차근차근 준비하세요.', rev:'인내심을 잃으면 좋은 기회를 놓칩니다.' },
      business_promotion:{ up:'꾸준하고 균형 잡힌 업무 태도가 인정받습니다.', rev:'조급함이 실수를 부릅니다.' },
      business_start:{ up:'점진적인 성장을 추구하세요.', rev:'무리한 확장은 위험합니다.' },
      wealth:{ up:'절제된 소비와 균형 잡힌 투자가 안정을 가져옵니다.', rev:'과소비를 경계하세요.' }
    }
  },
  {
    id:15, number:'XV', name:'The Devil', nameKo:'악마', emoji:'😈',
    interpretations:{
      general:{ up:'유혹이나 집착에 빠져 있지 않은지 살펴보세요.', rev:'나쁜 습관에서 벗어나고 있습니다.' },
      love_solo:{ up:'외적 조건에 현혹되지 마세요.', rev:'건강하지 못한 관계 패턴에서 벗어나고 있습니다.' },
      love_couple:{ up:'집착이나 의존 관계를 점검하세요.', rev:'관계의 건강하지 못한 부분을 인식하고 변화를 시작합니다.' },
      business_change:{ up:'물질적 조건에만 끌리지 마세요.', rev:'불건전한 근무 환경에서 벗어날 때입니다.' },
      business_promotion:{ up:'정치적 수완에 의존하지 마세요.', rev:'부정한 방법을 포기하는 용기가 필요합니다.' },
      business_start:{ up:'단기 이익에 현혹되지 마세요.', rev:'잘못된 사업 방향에서 벗어나고 있습니다.' },
      wealth:{ up:'물질적 욕심을 경계하세요.', rev:'금전적 집착에서 자유로워지고 있습니다.' }
    }
  },
  {
    id:16, number:'XVI', name:'The Tower', nameKo:'탑', emoji:'⚡',
    interpretations:{
      general:{ up:'급작스러운 변화가 일어나지만, 파괴 후 재건이 이루어집니다.', rev:'경고 신호를 무시하지 마세요.' },
      love_solo:{ up:'충격적인 만남이 인생을 바꿀 수 있습니다.', rev:'과거의 상처를 치유하지 않으면 반복됩니다.' },
      love_couple:{ up:'관계의 근본적인 문제가 드러납니다.', rev:'위기를 피하려 하지 말고 정면으로 대응하세요.' },
      business_change:{ up:'예상치 못한 해고나 변화가 오히려 전환점이 됩니다.', rev:'직장 내 위기 신호를 감지하고 대비하세요.' },
      business_promotion:{ up:'조직 개편 등의 변화가 기회가 될 수 있습니다.', rev:'안정을 추구하되 변화에 준비하세요.' },
      business_start:{ up:'파괴적 혁신이 성공의 열쇠입니다.', rev:'리스크 관리를 철저히 하세요.' },
      wealth:{ up:'재정적 충격이 올 수 있지만 회복이 가능합니다.', rev:'금전적 위기를 미리 대비하세요.' }
    }
  },
  {
    id:17, number:'XVII', name:'The Star', nameKo:'별', emoji:'⭐',
    interpretations:{
      general:{ up:'희망과 영감의 빛이 비춥니다.', rev:'희망을 잃고 비관적인 상태에 빠져 있을 수 있습니다.' },
      love_solo:{ up:'이상적인 사랑이 가까이 다가오고 있습니다.', rev:'기대를 너무 낮추거나 포기하지 마세요.' },
      love_couple:{ up:'관계에 희망과 치유의 에너지가 흐릅니다.', rev:'기대가 현실과 맞지 않아 실망할 수 있습니다.' },
      business_change:{ up:'꿈꿔왔던 직장에 가까워지고 있습니다.', rev:'행동하지 않으면 꿈만 꾸게 됩니다.' },
      business_promotion:{ up:'밝은 전망이 보입니다.', rev:'승진에 대한 기대가 무너질 수 있습니다.' },
      business_start:{ up:'창업의 비전이 빛나는 시기입니다.', rev:'이상만 높고 현실적 계획이 부족합니다.' },
      wealth:{ up:'재정적 희망이 보입니다.', rev:'재정적 목표가 불분명합니다.' }
    }
  },
  {
    id:18, number:'XVIII', name:'The Moon', nameKo:'달', emoji:'🌙',
    interpretations:{
      general:{ up:'불확실성과 혼란의 시기입니다. 직감을 믿되 신중하게.', rev:'두려움에서 벗어나고 있습니다.' },
      love_solo:{ up:'감정의 혼란 속에 있을 수 있습니다.', rev:'오해가 풀리고 상대의 진심이 보입니다.' },
      love_couple:{ up:'오해나 불신이 드리울 수 있습니다.', rev:'불안감이 해소되기 시작합니다.' },
      business_change:{ up:'이직 제안의 이면을 꼼꼼히 살펴보세요.', rev:'불안이 해소되고 상황이 명확해집니다.' },
      business_promotion:{ up:'직장 내 정치가 복잡할 수 있습니다.', rev:'혼란이 정리됩니다.' },
      business_start:{ up:'시장 상황이 불투명합니다.', rev:'방향이 명확해지기 시작합니다.' },
      wealth:{ up:'사기나 속임수에 주의하세요.', rev:'금전적 불안이 해소됩니다.' }
    }
  },
  {
    id:19, number:'XIX', name:'The Sun', nameKo:'태양', emoji:'☀️',
    interpretations:{
      general:{ up:'밝은 에너지와 성공의 기운이 넘칩니다.', rev:'자신감이 부족하거나 성공이 지연될 수 있습니다.' },
      love_solo:{ up:'밝고 즐거운 만남이 기다리고 있습니다.', rev:'연애에 대한 자신감이 부족할 수 있습니다.' },
      love_couple:{ up:'관계에 행복과 기쁨이 넘칩니다.', rev:'관계의 열정이 다소 식을 수 있습니다.' },
      business_change:{ up:'새 직장에서 빛나는 성과를 낼 수 있습니다.', rev:'적응에 시간이 걸릴 수 있습니다.' },
      business_promotion:{ up:'눈부신 성과로 승진이 확정적입니다.', rev:'살짝 지연될 수 있지만 반드시 이루어집니다.' },
      business_start:{ up:'사업이 크게 성공할 수 있는 시기입니다.', rev:'기대만큼 빠르게 성장하지 않을 수 있습니다.' },
      wealth:{ up:'금전 운이 매우 좋습니다.', rev:'재정적 성과가 기대에 못 미칠 수 있습니다.' }
    }
  },
  {
    id:20, number:'XX', name:'Judgement', nameKo:'심판', emoji:'📯',
    interpretations:{
      general:{ up:'과거를 돌아보고 새로운 소명을 발견하는 시기입니다.', rev:'과거의 실수에 매여 앞으로 나아가지 못하고 있습니다.' },
      love_solo:{ up:'더 성숙한 사랑을 시작할 준비가 되었습니다.', rev:'과거의 상처에 사로잡혀 있습니다.' },
      love_couple:{ up:'관계를 재평가하고 더 깊은 이해로 나아갑니다.', rev:'과거의 잘못을 용서하고 새로 시작하세요.' },
      business_change:{ up:'커리어의 전환점에 서 있습니다.', rev:'과거의 실패가 새로운 도전을 두렵게 합니다.' },
      business_promotion:{ up:'그동안의 경력이 종합적으로 평가받습니다.', rev:'이전의 실수에 대한 평가가 발목을 잡을 수 있습니다.' },
      business_start:{ up:'확실한 비전과 사명감이 있다면 성공합니다.', rev:'과거 실패의 트라우마를 극복하세요.' },
      wealth:{ up:'재정 상태를 전면 재검토할 때입니다.', rev:'과거의 금전적 실수를 되풀이하지 마세요.' }
    }
  },
  {
    id:21, number:'XXI', name:'The World', nameKo:'세계', emoji:'🌍',
    interpretations:{
      general:{ up:'하나의 큰 순환이 완성되는 시기입니다. 성취감을 맛보게 됩니다.', rev:'완성 직전에 막힌 느낌이 있을 수 있습니다.' },
      love_solo:{ up:'자기 자신을 완전히 사랑하게 되었을 때 최고의 파트너가 나타납니다.', rev:'완벽한 준비를 기다리지 마세요. 지금도 충분합니다.' },
      love_couple:{ up:'관계가 완전한 성숙에 이릅니다.', rev:'관계의 정체기를 느끼고 있습니다.' },
      business_change:{ up:'이직의 대성공이 기다립니다.', rev:'마무리가 지연되고 있습니다.' },
      business_promotion:{ up:'최고의 자리에 오를 수 있습니다.', rev:'마지막 관문이 남아 있습니다.' },
      business_start:{ up:'사업이 완벽하게 궤도에 오릅니다.', rev:'완성도가 아직 부족합니다.' },
      wealth:{ up:'재정적 목표를 달성하는 시기입니다.', rev:'목표 달성이 지연되고 있습니다.' }
    }
  }
];

export const CARD_TRANSLATIONS: Record<number, { desc: string; meaning_up: string; meaning_rev: string }> = {
  0:  { desc:'절벽 끝에 선 젊은 여행자가 하늘을 올려다보며 첫 발을 내딛으려 합니다.', meaning_up:'시작, 자유, 순수함, 모험', meaning_rev:'무모함, 부주의, 위험 감수' },
  1:  { desc:'한 손은 하늘을, 다른 손은 땅을 가리키는 마법사가 도구들을 다루고 있습니다.', meaning_up:'의지력, 창조, 집중, 기술', meaning_rev:'속임수, 조작, 재능 낭비' },
  2:  { desc:'달의 왕관을 쓴 여사제가 두 기둥 사이에 앉아 있습니다.', meaning_up:'직관, 신비, 내면의 지혜', meaning_rev:'숨겨진 의도, 직감 무시' },
  3:  { desc:'풍요로운 자연 속 왕좌에 앉은 여황제가 별 왕관을 쓰고 있습니다.', meaning_up:'풍요, 모성, 아름다움, 자연', meaning_rev:'의존, 공허, 과잉 집착' },
  4:  { desc:'돌 왕좌에 앉은 황제가 수염을 기르고 붉은 로브를 걸치고 있습니다.', meaning_up:'권위, 안정, 체계, 리더십', meaning_rev:'통제욕, 완고함, 유연성 부족' },
  5:  { desc:'종교적 예복을 입은 교황이 축복을 내리고 있습니다.', meaning_up:'전통, 지혜, 가르침, 조언', meaning_rev:'관습 타파, 독자적 길' },
  6:  { desc:'천사가 하늘에서 축복을 내리는 가운데 남녀가 마주보고 있습니다.', meaning_up:'사랑, 조화, 선택, 유대', meaning_rev:'갈등, 불화, 가치관 충돌' },
  7:  { desc:'별이 새겨진 캐노피 아래 전사가 스핑크스를 이끕니다.', meaning_up:'의지력, 승리, 결단, 돌진', meaning_rev:'방향 상실, 통제 불능' },
  8:  { desc:'여인이 사자의 입을 부드럽게 열고 있습니다.', meaning_up:'내면의 힘, 인내, 용기', meaning_rev:'자기 의심, 불안, 내면 갈등' },
  9:  { desc:'은둔자가 높은 산 위에서 등불을 비추고 있습니다.', meaning_up:'성찰, 내면 탐구, 지혜', meaning_rev:'고립, 외로움, 단절' },
  10: { desc:'구름 속에 거대한 수레바퀴가 돌아가고 있습니다.', meaning_up:'운명, 전환점, 행운, 순환', meaning_rev:'역경, 변동' },
  11: { desc:'정의의 여신이 저울과 칼을 들고 있습니다.', meaning_up:'공정, 진실, 균형', meaning_rev:'불공정, 편향' },
  12: { desc:'거꾸로 매달린 사람이 평온한 표정을 짓고 있습니다.', meaning_up:'희생, 새로운 관점, 내려놓음', meaning_rev:'불필요한 희생, 우유부단' },
  13: { desc:'갑옷을 입은 해골 기사가 백마를 타고 있습니다.', meaning_up:'변화, 끝과 시작, 변환', meaning_rev:'변화 거부, 집착, 정체' },
  14: { desc:'천사가 두 잔 사이로 물을 옮기고 있습니다.', meaning_up:'균형, 절제, 인내, 조화', meaning_rev:'불균형, 과도함, 조급함' },
  15: { desc:'어둠 속 날개 달린 악마가 좌대 위에 앉아 있습니다.', meaning_up:'유혹, 집착, 속박', meaning_rev:'해방, 자유' },
  16: { desc:'번개가 탑을 때려 왕관이 날아가고 있습니다.', meaning_up:'급변, 충격, 재건, 각성', meaning_rev:'경고 무시, 파국 회피' },
  17: { desc:'별이 가득한 밤하늘 아래 두 물병에서 물을 붓고 있습니다.', meaning_up:'희망, 영감, 치유', meaning_rev:'희망 상실, 비관' },
  18: { desc:'보름달이 두 탑 사이에 걸려 있고 가재가 기어 나옵니다.', meaning_up:'불확실성, 직감, 무의식', meaning_rev:'두려움 극복, 진실 발견' },
  19: { desc:'찬란한 태양 아래 아이가 흰 말 위에서 기뻐합니다.', meaning_up:'기쁨, 성공, 활력', meaning_rev:'자신감 부족, 지연' },
  20: { desc:'천사가 나팔을 불자 사람들이 일어나고 있습니다.', meaning_up:'각성, 소명, 재탄생', meaning_rev:'과거 집착, 후회' },
  21: { desc:'월계관으로 둘러싸인 무용수가 춤추고 있습니다.', meaning_up:'완성, 성취, 통합', meaning_rev:'미완성, 정체' }
};

// 로컬에 복사된 Rider-Waite-Smith 타로 이미지 (public/images/tarot/)
// 외부 CDN(Wikimedia) 직링크 시 Cloudflare 배포에서 CORS/rate-limit 문제가 발생하여 로컬로 이관.
export const CARD_IMAGES = [
  '/images/tarot/00.jpg',
  '/images/tarot/01.jpg',
  '/images/tarot/02.jpg',
  '/images/tarot/03.jpg',
  '/images/tarot/04.jpg',
  '/images/tarot/05.jpg',
  '/images/tarot/06.jpg',
  '/images/tarot/07.jpg',
  '/images/tarot/08.jpg',
  '/images/tarot/09.jpg',
  '/images/tarot/10.jpg',
  '/images/tarot/11.jpg',
  '/images/tarot/12.jpg',
  '/images/tarot/13.jpg',
  '/images/tarot/14.jpg',
  '/images/tarot/15.jpg',
  '/images/tarot/16.jpg',
  '/images/tarot/17.jpg',
  '/images/tarot/18.jpg',
  '/images/tarot/19.jpg',
  '/images/tarot/20.jpg',
  '/images/tarot/21.jpg'
];

export const TOPIC_LABELS: Record<string, string> = {
  general: '제너럴 운세',
  love: '연애 운세',
  love_solo: '연애 운세 (솔로)',
  love_couple: '연애 운세 (커플)',
  business: '사업 운세',
  business_change: '사업 운세 (이직)',
  business_promotion: '사업 운세 (승진)',
  business_start: '사업 운세 (개업)',
  wealth: '재물 운세'
};

export const CARD_ORDER_LABELS = ['첫 번째', '두 번째', '세 번째'];

export function generateReading(cards: DrawnCard[], topicKey: string): string {
  const c = cards.map(dc => ({
    card: MAJOR_ARCANA[dc.id],
    rev: dc.reversed,
    interp: (MAJOR_ARCANA[dc.id].interpretations[topicKey] || MAJOR_ARCANA[dc.id].interpretations.general)
  }));

  const positiveIds = [0,1,3,6,10,17,19,21];
  const challengeIds = [13,15,16,18];
  const positiveCount = cards.filter(x => positiveIds.includes(x.id) && !x.reversed).length;
  const challengeCount = cards.filter(x => challengeIds.includes(x.id) || x.reversed).length;
  const energy = positiveCount >= 2 ? '긍정' : challengeCount >= 2 ? '도전' : '혼합';

  let r = `당신이 선택한 세 장의 카드 — <strong>${c[0].card.nameKo}</strong>, <strong>${c[1].card.nameKo}</strong>, <strong>${c[2].card.nameKo}</strong> — 가 하나의 이야기를 들려줍니다.<br><br>`;

  if (energy === '긍정') {
    r += '세 카드가 모두 <strong>밝고 순조로운 흐름</strong>을 가리키고 있습니다. 지금 당신을 둘러싼 에너지는 전반적으로 당신의 편이며, 움직이는 방향이 옳다는 신호입니다.';
  } else if (energy === '도전') {
    r += '세 카드가 공통적으로 <strong>시련과 성장의 에너지</strong>를 담고 있습니다. 쉽지 않은 구간을 지나고 있지만, 이 과정이 당신을 단련시키고 있습니다.';
  } else {
    r += '세 카드에 <strong>빛과 그림자가 공존</strong>하고 있습니다. 좋은 흐름을 살리되, 경계해야 할 부분도 놓치지 마세요.';
  }
  r += '<br><br>';

  r += `<strong>${c[0].card.emoji} ${c[0].card.nameKo}</strong>${c[0].rev ? ' (역방향)' : ' (정방향)'}은 지금 당신이 처한 상황의 핵심을 보여줍니다. ${c[0].rev ? c[0].interp.rev : c[0].interp.up}<br><br>`;
  r += `<strong>${c[1].card.emoji} ${c[1].card.nameKo}</strong>${c[1].rev ? ' (역방향)' : ' (정방향)'}의 에너지가 겹쳐집니다. ${c[1].rev ? c[1].interp.rev : c[1].interp.up}<br><br>`;
  r += `<strong>${c[2].card.emoji} ${c[2].card.nameKo}</strong>${c[2].rev ? ' (역방향)' : ' (정방향)'}이 앞으로의 방향을 비춰줍니다. ${c[2].rev ? c[2].interp.rev : c[2].interp.up}<br><br>`;

  const uprightCount = cards.filter(x => !x.reversed).length;
  const hasStrengthCards = cards.some(x => [7,8,11].includes(x.id) && !x.reversed);
  const hasChangeCards = cards.some(x => [0,10,13,16,20].includes(x.id));
  const hasSuccessCards = cards.some(x => [19,21,3].includes(x.id) && !x.reversed);
  const hasWisdomCards = cards.some(x => [2,5,9,14].includes(x.id));

  r += '<strong>✦ 카드 조합 메시지</strong><br>';
  if (hasSuccessCards && uprightCount >= 2) {
    r += '성취와 풍요의 에너지가 강하게 나타납니다. 현재의 노력을 멈추지 마세요.';
  } else if (hasChangeCards && hasStrengthCards) {
    r += '변화의 카드와 힘의 카드가 함께 나왔습니다. 두려워하지 말고 변화의 흐름에 올라타세요.';
  } else if (hasWisdomCards && uprightCount >= 2) {
    r += '지혜와 성찰의 에너지가 강합니다. 한 발 물러서서 전체 그림을 보세요.';
  } else if (challengeCount >= 2) {
    r += '도전적인 카드가 겹쳐 나왔지만, 이는 큰 성장의 전조입니다.';
  } else {
    r += '세 카드가 고르게 분포된 에너지를 보여줍니다. 꾸준한 전진이 어울리는 시기입니다.';
  }

  const closingMessages = [
    ' ✨ 별빛은 길을 비출 뿐, 걸어가는 것은 당신의 선택입니다.',
    ' ✨ 운명은 매 순간 만들어가는 것입니다.',
    ' ✨ 타로는 가능성의 지도입니다. 최종 결정은 당신의 것입니다.'
  ];
  r += closingMessages[Math.floor(Math.random() * closingMessages.length)];

  return r;
}

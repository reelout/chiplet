const list = `
  乁(⌣ᨓ⌣”)ㄏ
  (・∀・)
  ᔪ꒰ ꒪ω꒪ |||꒱
  ∑(O_O；)
  ¯\\_◕ ε ◕_/¯
  q▰⏠▰p
  └[  Д  ]┘
  ¯\\_⌐■‸■_/¯
  \\(ᗒ﹏ᗕ)/
  ᖗT⏠Tᖘ
  (∩■‸■)⊃━☆ﾟ.*
  (・v・)
  \\(・_・)/
  ⎝ º □ º ⎠
  ヽ(◔.◔)ﾉ
  (づ  ͯ⏠  ͯ)づ
  ʕ⍜╭╮⍜ʔ
  (⇀╭╮↼)
  乁(¬Ĺ̯¬)ㄏ
  ᑫ ﾟᗝ ﾟᑷ
  ᕳಠ⏠ಠᕲ
  ⸮Ȍ⏠Ȍ?
`
  .split('\n')
  .map((item) => item.trim())
  .filter((item) => item.length > 0)

export const randomKaomoji = () => {
  return list[Math.floor(Math.random() * list.length)]
}
